import re
content = open(r'C:\Users\hemas\.gemini\antigravity\brain\277622f0-f917-4659-88d9-d6ce4422d18d\.system_generated\steps\206\content.md', encoding='utf-8').read()
urls = set(re.findall(r'https?://images\.sharepal\.in/[^\s\)\"\''\\]+\.webp', content))
for u in urls:
    print(u)
