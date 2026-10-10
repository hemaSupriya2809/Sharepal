import re
c=open(r'C:\Users\hemas\.gemini\antigravity\brain\277622f0-f917-4659-88d9-d6ce4422d18d\.system_generated\steps\206\content.md', encoding='utf-8').read()
print('\n'.join(re.findall(r'https?://[^\s\)\"\'\\]+(?:switch|nintendo|handheld|portal)[^\s\)\"\'\\]*\.webp', c, re.I)))
