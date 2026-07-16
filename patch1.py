import sys

def modify_app_js():
    with open('app.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inject checkup modal function at the top (after clientConfigs)
    if 'window.showCheckupSupportModal' not in content:
        modal_code = """
window.showCheckupSupportModal = function () {
  const client = state.activeClient;
  const activeSite = state.activeSite;

  const existing = document.getElementById('checkup-support-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'checkup-support-modal-overlay';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '10000';
  overlay.style.animation = 'fadeIn 0.2s ease-out';

  overlay.innerHTML = `
    <div style="background: white; border-radius: 16px; width: 340px; padding: 28px 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); text-align: center; font-family: inherit;">
      <h3 style="font-size: 19px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0;">회사지원 확인</h3>
      <p style="font-size: 14.5px; color: #475569; margin: 0 0 28px 0; font-weight: 600; line-height: 1.5;">회사지원 건강검진이신가요?</p>
      <div style="display: flex; gap: 12px;">
        <button onclick="window.handleCheckupSupportChoice(false)" style="flex: 1; padding: 12px; background: #eff6ff; color: #2563eb; font-size: 15px; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#dbeafe'" onmouseout="this.style.background='#eff6ff'">아니오</button>
        <button onclick="window.handleCheckupSupportChoice(true)" style="flex: 1; padding: 12px; background: #2563eb; color: white; font-size: 15px; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'">네</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
};

window.handleCheckupSupportChoice = function (isCorporate) {
  const overlay = document.getElementById('checkup-support-modal-overlay');
  if (overlay) overlay.remove();

  const client = state.activeClient;
  const activeSite = state.activeSite;

  if (isCorporate) {
    window.location.hash = `#/portal/${client.id}/${activeSite.siteId}/checkupAppt/checkupCorporate`;
  } else {
    window.location.hash = `#/portal/${client.id}/${activeSite.siteId}/checkupAppt/checkupPreferred`;
  }
};
"""
        target = "const defaultMenus = ["
        content = content.replace(target, modal_code + "\n" + target)

    # 2. Add Redirection for checkupAppt in renderPortal
    if "if (state.activeMenuId === 'checkupAppt' && !state.activeSubId)" not in content:
        target2 = """  // Redirection logic for service guide submenus
  if (state.activeMenuId === 'serviceGuide') {"""
        repl2 = """  // Redirection logic for checkupAppt
  if (state.activeMenuId === 'checkupAppt' && !state.activeSubId) {
    window.showCheckupSupportModal();
    return;
  }
  
  // Redirection logic for healthConsulting
  if (state.activeMenuId === 'healthConsulting' && !state.activeSubId) {
    window.location.hash = `#/portal/${client.id}/${activeSite.siteId}/healthConsulting/general`;
    return;
  }

  // Redirection logic for service guide submenus
  if (state.activeMenuId === 'serviceGuide') {"""
        content = content.replace(target2, repl2)

    with open('app.js', 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("app.js modified successfully (step 1 & 2)!")

modify_app_js()
