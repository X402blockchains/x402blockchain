"""Validate prepared listing records without network requests or payments."""
import argparse
import json
import math
import re
from pathlib import Path
from urllib.parse import parse_qsl, urlsplit


def require(condition, message):
    if not condition:
        raise ValueError(message)


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        require(key not in result, f"Duplicate JSON key: {key}")
        result[key] = value
    return result


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"), object_pairs_hook=unique_object)


def https_url(value, field, host=None):
    require(isinstance(value, str), f"{field}: URL must be a string")
    parsed = urlsplit(value)
    require(parsed.scheme == "https" and bool(parsed.hostname), f"{field}: HTTPS URL required")
    require(not parsed.username and not parsed.password, f"{field}: credentials are prohibited")
    private_keys = {"access_token", "token", "api_key", "apikey", "secret", "password", "authorization"}
    require(not any(key.lower() in private_keys for key, _ in parse_qsl(parsed.query)),
            f"{field}: private URL parameters are prohibited")
    if host:
        require(parsed.hostname == host, f"{field}: expected {host}")
    return parsed


def validate_project(project):
    require(isinstance(project, dict), "Project must be an object")
    for field in ("name", "role", "description"):
        require(isinstance(project.get(field), str) and project[field].strip(), f"{field}: required")
    for field in ("website", "endpoint"):
        https_url(project.get(field), field)
    for field in ("logo", "docs"):
        if project.get(field) is not None:
            https_url(project[field], field)
    require(project.get("networks") == ["Base"], "Prepared basic approval scope must remain Base-only")
    approval = project.get("approval", {})
    require(approval.get("status") == "approved_basic_directory", "Basic approval status required")
    require(approval.get("by") == "X402blockchains", "Maintainer approval required")
    decision = https_url(approval.get("decisionUrl"), "approval.decisionUrl", "github.com")
    require(decision.path.startswith("/X402blockchains/") and decision.fragment.startswith(
        ("pullrequestreview-", "issuecomment-")), "Approval must link a recorded maintainer decision")
    https_url(approval.get("submissionUrl"), "approval.submissionUrl", "github.com")
    scan = project.get("x402scan", {})
    profile = https_url(scan.get("profile"), "x402scan.profile", "www.x402scan.com")
    require(re.fullmatch(r"/server/[0-9a-f-]{36}", profile.path) is not None, "Exact x402scan server profile required")
    origin = https_url(scan.get("origin"), "x402scan.origin")
    require(origin.hostname == urlsplit(project["endpoint"]).hostname, "Endpoint and indexed origin must match")
    publication = project.get("publication", {})
    require(publication.get("status") == "prepared_not_published" and publication.get("date") is None,
            "Preparation metadata must not claim website publication")
    require(type(publication.get("batch")) is int and publication["batch"] >= 1, "Positive integer batch required")
    require(isinstance(publication.get("prePublicationChecks"), list) and publication["prePublicationChecks"],
            "Publication checks required")
    addresses = project.get("paymentAddresses", [])
    require(addresses and all(a.get("network") == "Base" and re.fullmatch(r"0x[0-9a-fA-F]{40}",
            a.get("address", "")) for a in addresses), "Valid Base receiving addresses required")
    receipts = project.get("settlementExamples", [])
    require(bool(receipts), "Sample settlement evidence required")
    for receipt in receipts:
        require(receipt.get("network") == "Base" and receipt.get("token") == "USDC", "Base USDC evidence required")
        amount = receipt.get("amount")
        require(type(amount) in (int, float) and math.isfinite(amount) and amount > 0, "Positive finite amount required")
        tx = receipt.get("transaction", "")
        require(re.fullmatch(r"0x[0-9a-fA-F]{64}", tx) is not None, "Valid transaction hash required")
        explorer = https_url(receipt.get("explorer"), "settlement.explorer", "basescan.org")
        require(explorer.path == "/tx/" + tx, "Explorer link must match the transaction hash")
        require(receipt.get("receiptStatus") == "success" and receipt.get("recipientAmountMatched") is True,
                "Reviewed successful receipt and recipient/amount match required")
        require(type(receipt.get("operatorSelfPayment")) is bool and receipt.get("customerIdentityVerified") is False,
                "Preserve operator-test labels and avoid unverified customer claims")


def validate_manifest(path):
    manifest = read_json(path)
    projects = manifest.get("projects", [])
    require(isinstance(projects, list) and bool(projects), "Non-empty project list required")
    require(type(manifest.get("projectCount")) is int and manifest["projectCount"] == len(projects), "Project count mismatch")
    names = [project.get("name") for project in projects]
    require(all(isinstance(name, str) for name in names) and len(set(names)) == len(names), "Duplicate or invalid project names")
    batches = manifest.get("batches", [])
    require([b.get("batch") for b in batches] == list(range(1, len(batches) + 1)), "Batch numbering must be consecutive")
    scheduled = [name for batch in batches for name in batch.get("projects", [])]
    require(len(scheduled) == len(names) and set(scheduled) == set(names), "Batch membership must cover each project once")
    require(all(1 <= len(b.get("projects", [])) <= 6 for b in batches), "Each batch must contain one to six projects")
    for project in projects:
        validate_project(project)
        batch = project["publication"]["batch"]
        require(batch <= len(batches) and project["name"] in batches[batch - 1]["projects"], "Project batch mismatch")
        slug = re.sub(r"[^a-z0-9]+", "-", project["name"].lower()).strip("-")
        record = path.parent / (slug + ".json")
        require(record.is_file(), f"Missing project file: {record.name}")
        require(read_json(record) == project, f"Project file differs from manifest: {record.name}")
    return len(projects)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    paths = sorted((args.root / "listings" / "prepared").glob("*/manifest.json"))
    require(bool(paths), "No prepared listing manifests found")
    count = sum(validate_manifest(path) for path in paths)
    print(f"Validated {count} listing records across {len(paths)} preparation package(s).")
    print("Checks are structural; current service operation and website publication require separate review.")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, KeyError, TypeError, OSError) as error:
        raise SystemExit(f"Listing validation failed: {error}")
