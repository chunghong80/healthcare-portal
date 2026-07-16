import os

with open('app.js', 'r', encoding='utf8') as f:
    content = f.read()

# 1. Start part
target1 = """    } else if (isMedicalApptGroup) {
      if (!state.activeSubId) {"""
replacement1 = """    } else if (isMedicalApptGroup) {"""

if target1 in content:
    content = content.replace(target1, replacement1)
    print("Replaced start 1")
else:
    print("target1 not found")

# 2. End part
target2 = """          </div>
        `;
      }
    } else if (isCheckupGroup) {"""
replacement2 = """          </div>
        `;
    } else if (isCheckupGroup) {"""

if target2 in content:
    content = content.replace(target2, replacement2)
    print("Replaced end 2")
else:
    print("target2 not found")

with open('app.js', 'w', encoding='utf8') as f:
    f.write(content)
