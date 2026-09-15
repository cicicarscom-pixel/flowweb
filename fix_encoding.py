import os

filepath = 'src/app/(dashboard)/analiz/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    'Ä±': '�',
    'Ã¼': '�',
    'Ã¶': '�',
    'ÅŸ': '�',
    'ÄŸ': '�',
    'Ã§': '�',
    'Åž': '�',
    'Ä°': '�',
    'Ã': '�',
    'Ã': '�',
    'Ã': '�',
    'Äž': '�',
    'Ä': '�',
    'Äž': '�',
    'Ä±': '�',
    # Handle single byte corruptions if any
    'Y': '',
    '': '', 
}

# The best way to fix this double encoding is to encode back to latin-1 and decode as utf-8
try:
    # First let's test if simple encode/decode fixes it
    fixed = content.encode('latin-1').decode('utf-8')
    content = fixed
except Exception as e:
    # Fallback to string replace
    print('latin-1 decode failed, using string replacement')
    for bad, good in replacements.items():
        content = content.replace(bad, good)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Encoding fixed!')
