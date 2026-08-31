const fs = require('fs');
const file_path = 'src/app/(dashboard)/ai-asistan/randevu/RandevuClient.tsx';
let content = fs.readFileSync(file_path, 'utf-8');

content = content.replace('display: "grid", gridTemplateColumns: "1fr 340px", gap: 32', 'display: "flex", flexDirection: "column", gap: 32');

const timeline_start = content.indexOf('{/* Timeline */}');
const right_col_start = content.indexOf('{/* Right Column (Heatmap) */}');
const grid_closing_tags = '      </div>\r\n\r\n      {/* Cute Modal */}';
let right_col_block_end = content.indexOf(grid_closing_tags, right_col_start);

if (right_col_block_end === -1) {
    const fallback = '      </div>\n\n      {/* Cute Modal */}';
    right_col_block_end = content.indexOf(fallback, right_col_start);
}

if (timeline_start === -1 || right_col_start === -1 || right_col_block_end === -1) {
  console.error('Error finding sections: ' + timeline_start + ' ' + right_col_start + ' ' + right_col_block_end);
  process.exit(1);
}

const timeline_block = content.substring(timeline_start, right_col_start);
const right_col_block = content.substring(right_col_start, right_col_block_end);

const new_content = content.substring(0, timeline_start) + right_col_block + '\n          ' + timeline_block + '\n' + content.substring(right_col_block_end);

fs.writeFileSync(file_path, new_content, 'utf-8');
console.log('Success');
