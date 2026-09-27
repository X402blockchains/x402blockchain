import{createDb}from'./local-db.mjs';
const[id,status,...noteParts]=process.argv.slice(2),note=noteParts.join(' ');
if(!id||!['approved','rejected','needs_information'].includes(status)||note.length<20){console.error('Usage: node scripts/review-local-listing.mjs ID approved|rejected|needs_information "Evidence and review note (20+ characters)"');process.exit(1)}
const db=createDb('.local/development.sqlite'),row=await db.prepare('SELECT id FROM portal_applications WHERE id=?').bind(id).first();if(!row)throw Error('Application not found');await db.prepare('UPDATE portal_applications SET status=?,note=?,updated_at=? WHERE id=?').bind(status,note,Date.now(),id).run();console.log(JSON.stringify({id,status,note}));
