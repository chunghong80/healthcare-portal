import json

with open(r'C:\Users\user\.gemini\antigravity\brain\92b04564-1f37-442b-b440-08cfe7d7f48c\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    lines = f.readlines()

output = []
for line in lines:
    try:
        obj = json.loads(line)
        if obj.get('type') == 'PLANNER_RESPONSE':
            tool_calls = obj.get('tool_calls', [])
            for tc in tool_calls:
                name = tc.get('name')
                args = tc.get('args', {})
                target_file = args.get('TargetFile', '')
                if 'app.js' in target_file:
                    output.append(f"========== STEP {obj.get('step_index')} : {name} ==========\n")
                    if name == 'replace_file_content':
                        output.append("--- TARGET ---\n")
                        output.append(args.get('TargetContent', ''))
                        output.append("\n--- REPLACEMENT ---\n")
                        output.append(args.get('ReplacementContent', ''))
                        output.append("\n\n")
                    elif name == 'multi_replace_file_content':
                        for chunk in args.get('ReplacementChunks', []):
                            output.append("--- TARGET ---\n")
                            output.append(chunk.get('TargetContent', ''))
                            output.append("\n--- REPLACEMENT ---\n")
                            output.append(chunk.get('ReplacementContent', ''))
                            output.append("\n\n")
    except:
        pass

with open('app_js_edits_py.txt', 'w', encoding='utf-8') as f:
    f.writelines(output)
