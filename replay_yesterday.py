import json
import os

# Path to yesterday's transcript
transcript_path = r"C:\Users\user\.gemini\antigravity\brain\92b04564-1f37-442b-b440-08cfe7d7f48c\.system_generated\logs\transcript_full.jsonl"
target_files = ['app.js', 'm_app.js']

# We will read the HEAD state first (already restored to HEAD)
# But wait, we should start from a clean HEAD just in case!
os.system('git checkout HEAD app.js m_app.js')

with open('app.js', 'r', encoding='utf8') as f:
    app_content = f.read()

with open('m_app.js', 'r', encoding='utf8') as f:
    m_app_content = f.read()

files = {
    'app.js': app_content,
    'm_app.js': m_app_content
}

# Also process today's transcript UP TO my first git checkout
today_transcript_path = r"C:\Users\user\.gemini\antigravity\brain\941f5a3c-5eb4-4067-83bb-6e858964b754\.system_generated\logs\transcript_full.jsonl"

def apply_replacements(content, filename, transcript_file, limit_step=-1):
    with open(transcript_file, 'r', encoding='utf8') as f:
        for line in f:
            obj = json.loads(line)
            step_index = obj.get("step_index", -1)
            
            if limit_step != -1 and step_index >= limit_step:
                break
                
            if obj.get('type') == 'PLANNER_RESPONSE':
                tool_calls = obj.get('tool_calls', [])
                for tc in tool_calls:
                    name = tc.get('name')
                    args = tc.get('args', {})
                    
                    target_file = args.get('TargetFile', '')
                    if not target_file.endswith(filename):
                        continue
                        
                    if name == 'replace_file_content':
                        target = args.get('TargetContent', '')
                        repl = args.get('ReplacementContent', '')
                        if target in content:
                            content = content.replace(target, repl)
                            print(f"[{filename}] Applied replace_file_content at step {step_index}")
                        else:
                            # Normalize line endings
                            target_crlf = target.replace('\n', '\r\n')
                            target_lf = target.replace('\r\n', '\n')
                            if target_crlf in content:
                                content = content.replace(target_crlf, repl.replace('\n', '\r\n'))
                                print(f"[{filename}] Applied CRLF replace_file_content at step {step_index}")
                            elif target_lf in content:
                                content = content.replace(target_lf, repl.replace('\r\n', '\n'))
                                print(f"[{filename}] Applied LF replace_file_content at step {step_index}")
                            else:
                                print(f"[{filename}] FAILED replace_file_content at step {step_index} - Target not found!")
                                
                    elif name == 'multi_replace_file_content':
                        chunks = args.get('ReplacementChunks', [])
                        for i, chunk in enumerate(chunks):
                            target = chunk.get('TargetContent', '')
                            repl = chunk.get('ReplacementContent', '')
                            if target in content:
                                content = content.replace(target, repl)
                                print(f"[{filename}] Applied multi_replace chunk {i} at step {step_index}")
                            else:
                                target_crlf = target.replace('\n', '\r\n')
                                target_lf = target.replace('\r\n', '\n')
                                if target_crlf in content:
                                    content = content.replace(target_crlf, repl.replace('\n', '\r\n'))
                                    print(f"[{filename}] Applied CRLF multi_replace chunk {i} at step {step_index}")
                                elif target_lf in content:
                                    content = content.replace(target_lf, repl.replace('\r\n', '\n'))
                                    print(f"[{filename}] Applied LF multi_replace chunk {i} at step {step_index}")
                                else:
                                    print(f"[{filename}] FAILED multi_replace chunk {i} at step {step_index} - Target not found!")
                    elif name == 'write_to_file':
                        code = args.get('CodeContent', '')
                        content = code
                        print(f"[{filename}] Applied write_to_file at step {step_index}")
    return content

print("=== REPLAYING YESTERDAY ===")
for file in target_files:
    files[file] = apply_replacements(files[file], file, transcript_path)

print("\n=== REPLAYING TODAY (until git checkout) ===")
# Wait, today I shouldn't replay anything because they were just my bug fixes that I can re-apply manually.
# In fact, my only good fix was the `isMedicalApptGroup` which I will apply manually.
# Wait, did the previous AI (in the truncated part of TODAY) make any OTHER changes?
# The truncated part of today: "Restoration Attempts: Executed fix_header.ps1 and fix_medical.ps1".
# So the previous AI today didn't add new features, just tried to fix bugs.
# So if I just replay yesterday, I get the final features!

for file, content in files.items():
    with open(file, 'w', encoding='utf8') as f:
        f.write(content)
        
print("\nReplay finished!")
