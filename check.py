import sys

def check(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(str(e))
        return
    
    stack = []
    pairs = {'{': '}', '[': ']', '(': ')'}
    rev_pairs = {v: k for k, v in pairs.items()}
    in_string = False
    string_char = ''
    in_template = False
    
    lines = content.split('\n')
    for line_idx, line in enumerate(lines):
        i = 0
        while i < len(line):
            c = line[i]
            if (in_string or in_template) and c == '\\\\':
                i += 2
                continue
                
            if in_string:
                if c == string_char:
                    in_string = False
            elif in_template:
                if c == '\':
                    in_template = False
                elif c == '$' and i+1 < len(line) and line[i+1] == '{':
                    stack.append(('{', line_idx+1))
                    i += 1
            else:
                if c in ['\"', '\'']:
                    in_string = True
                    string_char = c
                elif c == '\':
                    in_template = True
                elif c in pairs:
                    stack.append((c, line_idx+1))
                elif c in rev_pairs:
                    if not stack:
                        print(f'Unmatched {c} at line {line_idx+1}')
                        return
                    top, _ = stack.pop()
                    if top != rev_pairs[c]:
                        print(f'Mismatched {c} at line {line_idx+1}. Expected {pairs[top]}')
                        return
            i += 1
            
    if stack:
        print(f'Unclosed {stack[-1][0]} from line {stack[-1][1]}')
    elif in_template:
        print('Unclosed template literal')
    elif in_string:
        print('Unclosed string')
    else:
        print('No obvious brace mismatch found')

check('m_app.js')
