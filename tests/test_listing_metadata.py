import copy
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("listing_check", ROOT / "scripts/check_listing_metadata.py")
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)


class ListingValidationTests(unittest.TestCase):
    def setUp(self):
        self.manifest_path = next((ROOT / "listings/prepared").glob("*/manifest.json"))
        self.manifest = checker.read_json(self.manifest_path)
        self.project = copy.deepcopy(self.manifest["projects"][0])

    def test_prepared_package(self):
        self.assertEqual(checker.validate_manifest(self.manifest_path), self.manifest["projectCount"])

    def test_mismatched_receipt_is_rejected(self):
        self.project["settlementExamples"][0]["explorer"] = "https://basescan.org/tx/0x" + "0" * 64
        with self.assertRaisesRegex(ValueError, "Explorer link must match"):
            checker.validate_project(self.project)

    def test_private_url_is_rejected(self):
        self.project["website"] = "https://example.com/?access_token=private"
        with self.assertRaisesRegex(ValueError, "private URL parameters"):
            checker.validate_project(self.project)

    def test_unreviewed_network_expansion_is_rejected(self):
        self.project["networks"].append("Solana")
        with self.assertRaisesRegex(ValueError, "Base-only"):
            checker.validate_project(self.project)

    def test_premature_publication_claim_is_rejected(self):
        self.project["publication"]["status"] = "published"
        with self.assertRaisesRegex(ValueError, "must not claim website publication"):
            checker.validate_project(self.project)

    def test_duplicate_json_key_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "Duplicate JSON key"):
            json.loads('{"name":"first","name":"second"}', object_pairs_hook=checker.unique_object)

    def test_duplicate_batch_member_is_rejected(self):
        manifest = copy.deepcopy(self.manifest)
        manifest["batches"][0]["projects"].append(manifest["batches"][0]["projects"][0])
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "manifest.json"
            path.write_text(json.dumps(manifest))
            with self.assertRaisesRegex(ValueError, "each project once"):
                checker.validate_manifest(path)


if __name__ == "__main__":
    unittest.main()
