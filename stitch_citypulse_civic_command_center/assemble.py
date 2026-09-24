import re
import os

DIR = "/home/aadi/Documents/AimHacks/stitch_citypulse_civic_command_center"

def read_file(path):
    with open(os.path.join(DIR, path), 'r') as f:
        return f.read()

home = read_file('home_civicpulse_2/code.html')
overview = read_file('overview_pulse/code.html')
weather = read_file('weather_environment/code.html')
transit = read_file('transit_live_incidents/code.html')
complaints = read_file('complaints_311_panel_civicpulse/code.html')
login = read_file('resident_login_civicpulse/code.html')
home1 = read_file('home_civicpulse_1/code.html')

# Extract head from home_civicpulse_2
head_match = re.search(r'<head>.*?</head>', home, re.DOTALL)
head = head_match.group(0)

# Extract shared header from home_civicpulse_2
header_match = re.search(r'<header.*?</header>', home, re.DOTALL)
header = header_match.group(0)
# Modify nav in header
header = re.sub(
    r'<nav.*?</nav>',
    '''<nav class="hidden lg:flex items-center gap-1 p-1 bg-surface-container-low/90 rounded-full" id="main-nav">
  <a data-path="home" href="#home" class="nav-link px-space-md py-1.5 rounded-full transition-all bg-surface-container-lowest text-on-surface font-medium shadow-[0_1px_3px_rgba(0,0,0,0.06)]">Home</a>
  <a data-path="overview" href="#overview" class="nav-link px-space-md py-1.5 text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm rounded-full transition-all">Overview &amp; Pulse</a>
  <a data-path="weather" href="#weather" class="nav-link px-space-md py-1.5 text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm rounded-full transition-all">Weather &amp; Environment</a>
  <a data-path="transit" href="#transit" class="nav-link px-space-md py-1.5 text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm rounded-full transition-all">Transit &amp; Incidents</a>
  <a data-path="311" href="#311" class="nav-link px-space-md py-1.5 text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm rounded-full transition-all">311 Complaints</a>
</nav>''',
    header,
    flags=re.DOTALL
)
header = header.replace('<header ', '<header id="shared-header" ')

# Height consistency h-20 -> h-16 is requested in prompt, let's just make sure
header = header.replace('h-20', 'h-16')


# Extract shared footer from home_civicpulse_1
footer_match = re.search(r'<footer.*?</footer>', home1, re.DOTALL)
footer = footer_match.group(0)
footer = footer.replace('<footer ', '<footer id="shared-footer" ')

# Extract main content from pages
def extract_content(html, remove_svg=True):
    # Remove <svg class="inline-defs-container">
    if remove_svg:
        html = re.sub(r'<svg class="inline-defs-container".*?</svg>', '', html, flags=re.DOTALL)
    
    # Fix viewBox
    html = html.replace('viewbox', 'viewBox')

    # Get content inside <main ...> ... </main>
    # or just between <main ...> and </main>
    m = re.search(r'<main[^>]*>(.*?)</main>', html, re.DOTALL)
    if m:
        content = m.group(1)
    else:
        content = ""
        
    # Also extract any trailing scripts or modals or asides not in main (like floating widgets)
    # Actually it might be easier to extract anything between </header> and <footer or </body>
    # Let's extract <main>...</main> and any <aside>...</aside> or modals that are direct children of body.
    # For login, just get <main ...>...</main> and make it the section.
    
    # Let's do a more robust extraction:
    # 1. find </header>
    # 2. find <footer
    
    start_idx = html.find('</header>')
    end_idx = html.find('<footer')
    
    if start_idx != -1:
        if end_idx != -1:
            content_block = html[start_idx+9:end_idx].strip()
        else:
            content_block = html[start_idx+9:html.rfind('</body>')].strip()
    else:
        # no header? login page
        body_start = html.find('<body')
        body_start = html.find('>', body_start) + 1
        body_end = html.rfind('</body>')
        content_block = html[body_start:body_end].strip()
        
    return content_block

home_content = extract_content(home)
overview_content = extract_content(overview)
weather_content = extract_content(weather)
transit_content = extract_content(transit)
complaints_content = extract_content(complaints)
login_content = extract_content(login)

# For login, the body itself had classes: bg-surface font-body-md text-on-surface antialiased min-h-screen flex items-center justify-center p-margin-mobile
login_section_classes = "min-h-screen flex items-center justify-center p-margin-mobile w-full bg-surface"
# Login content is the <main> block, which is what extract_content(login) returned.

# For complaints_311, there is an emergency ribbon outside the <main> or inside it?
# Let's look at the complaints content:
# complaints_content should contain the ribbon if it was between header and footer.
# Let's ensure <main> tags are handled correctly, wait extract_content takes everything between header and footer, so it will contain the <main> tag itself!
# We don't want nested <main> tags, we should strip <main ...> and </main> from the content blocks.
def strip_main(block):
    block = re.sub(r'<main[^>]*>', '', block)
    block = block.replace('</main>', '')
    return block

home_content = strip_main(home_content)
overview_content = strip_main(overview_content)
weather_content = strip_main(weather_content)
transit_content = strip_main(transit_content)
complaints_content = strip_main(complaints_content)
# for login, keep main or strip? strip it and wrap in section.
login_content = strip_main(login_content)

router_script = """
<script>
const routes = {
  'home': 'page-home',
  'overview': 'page-overview',
  'overview-pulse': 'page-overview',
  'overview-and-pulse': 'page-overview',
  'weather': 'page-weather',
  'weather-environment': 'page-weather',
  'weather-and-environment': 'page-weather',
  'transit': 'page-transit',
  'transit-incidents': 'page-transit',
  'transit-and-live-incidents': 'page-transit',
  '311': 'page-311',
  'login': 'page-login',
  'resident-login': 'page-login'
};

function router() {
  let hash = window.location.hash.replace('#', '') || 'home';
  
  let targetId = routes[hash] || 'page-home';
  let targetHash = Object.keys(routes).find(key => routes[key] === targetId);

  // Update tabs
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('bg-surface-container-lowest', 'text-on-surface', 'font-medium', 'shadow-[0_1px_3px_rgba(0,0,0,0.06)]');
    link.classList.add('text-on-surface-variant', 'hover:text-on-surface', 'font-body-sm', 'text-body-sm');
    if (link.getAttribute('href') === '#' + targetHash) {
      link.classList.remove('text-on-surface-variant', 'hover:text-on-surface', 'font-body-sm', 'text-body-sm');
      link.classList.add('bg-surface-container-lowest', 'text-on-surface', 'font-medium', 'shadow-[0_1px_3px_rgba(0,0,0,0.06)]');
    }
  });

  // Show/Hide sections
  const pages = ['page-home', 'page-overview', 'page-weather', 'page-transit', 'page-311', 'page-login'];
  pages.forEach(p => {
    const el = document.getElementById(p);
    if(el) el.style.display = 'none';
  });
  const activePage = document.getElementById(targetId);
  if(activePage) activePage.style.display = 'block';

  // Header/footer toggle for login
  const header = document.getElementById('shared-header');
  const footer = document.getElementById('shared-footer');
  const main = document.getElementById('main-content');
  if(targetId === 'page-login') {
    if(header) header.style.display = 'none';
    if(footer) footer.style.display = 'none';
    if(main) main.classList.remove('pt-16');
  } else {
    if(header) header.style.display = 'block';
    if(footer) footer.style.display = 'flex';
    if(main) main.classList.add('pt-16');
  }

  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
    document.querySelectorAll('[data-path]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const path = link.getAttribute('data-path');
            if(routes[path]) {
                const targetId = routes[path];
                const targetHash = Object.keys(routes).find(key => routes[key] === targetId);
                window.location.hash = targetHash;
            }
        });
    });
    router();
});
</script>
"""

# Extract scripts from all pages to keep interactive functionality. 
# They are already in the content blocks! So they will be included in the sections.

final_html = f'''<!DOCTYPE html>
<html lang="en">
{head}
<body class="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
{header}

<main id="main-content" class="w-full pt-16 flex-grow flex flex-col">
  <section id="page-home" style="display: block;">
    {home_content}
  </section>
  
  <section id="page-overview" style="display: none;">
    {overview_content}
  </section>
  
  <section id="page-weather" style="display: none;">
    {weather_content}
  </section>
  
  <section id="page-transit" style="display: none;">
    {transit_content}
  </section>
  
  <section id="page-311" style="display: none;">
    {complaints_content}
  </section>
  
  <section id="page-login" style="display: none;" class="{login_section_classes}">
    {login_content}
  </section>
</main>

{footer}

{router_script}

</body>
</html>
'''

with open(os.path.join(DIR, 'index.html'), 'w') as f:
    f.write(final_html)

print("Done")
