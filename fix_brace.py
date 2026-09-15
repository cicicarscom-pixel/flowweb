import sys
content = open('src/app/(dashboard)/analiz/page.tsx', 'r', encoding='utf-8').read()
old_text = '''    );
  
  const renderInboxAnalytics = () => ('''
new_text = '''    );
  };
  
  const renderInboxAnalytics = () => ('''

if old_text in content:
    content = content.replace(old_text, new_text)
    open('src/app/(dashboard)/analiz/page.tsx', 'w', encoding='utf-8').write(content)
    print('Replaced')
else:
    print('Not found')
