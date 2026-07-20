# Oyarzun.com Infrastructure Changes — Complete Reference
Last Updated: 2025
Author: Tommy Oyarzun

---

## Overview

Started with a messy shared hosting setup where multiple sites were tangled together through domain forwarding and masking. Ended with clean independent sites each with proper DNS, SSL and hosting.

---

## Infrastructure Map

| Domain | Hosting | IP | SSL | Status |
|---|---|---|---|---|
| www.oyarzun.com | Vercel | 216.198.79.1 | Vercel Auto | Active |
| tomas.oyarzun.com | GoDaddy cPanel | 160.153.78.169 | Cloudflare Flexible | Active |
| thehousekeeper.biz | GoDaddy cPanel | 160.153.78.169 | Cloudflare Full | Active |
| saltlakecityjudo.org | GoDaddy cPanel | 160.153.78.169 | GoDaddy | Active |
| esperanza.oyarzun.com | GoDaddy cPanel | 160.153.78.169 | Cloudflare Proxied | Active |
| fotos.oyarzun.com | GoDaddy cPanel | 160.153.78.169 | Cloudflare Proxied | Active |
| mike.oyarzun.com | GoDaddy cPanel | 160.153.78.169 | Cloudflare Proxied | Active |
| tommy.oyarzun.com | GoDaddy cPanel | 160.153.78.169 | Cloudflare Proxied | Active |
| upload.oyarzun.com | GoDaddy cPanel | 160.153.78.169 | Cloudflare Proxied | Active |
| sucuriip.oyarzun.com | GoDaddy cPanel | 50.63.51.1 | Cloudflare Proxied | Active |

---

## Server Reference

| Item | Value |
|---|---|
| GoDaddy Shared Server IP | 160.153.78.169 |
| GoDaddy Home Directory | /home/zo81zqz6hc1h/ |
| GoDaddy Web Root | /home/zo81zqz6hc1h/public_html/ |
| Vercel IP | 216.198.79.1 |
| Vercel CNAME | 7f488413b101f54b.vercel-dns-017.com |
| WordPress Database Name | oya1328511301039 |
| WordPress Table Prefix | wp_ |
| WordPress Site | saltlakecityjudo.org |
| WordPress Admin | saltlakecityjudo.org/wp-admin |

---

## 1. OYARZUN.COM — Moved to Vercel

### Problem
Old site was hosted on GoDaddy shared hosting. New Next.js site built and deployed on Vercel. Needed DNS updated to point to Vercel. GoDaddy AutoSSL was not available causing self-signed cert errors on all subdomains. Duplicate A record could not be deleted through GoDaddy interface.

### DNS Changes

Nameservers changed from GoDaddy to Cloudflare:
- BEFORE: ns1.domaincontrol.com and ns2.domaincontrol.com
- AFTER: Cloudflare nameservers

A Record:
- BEFORE: A @ 192.124.249.20 (old GoDaddy server)
- AFTER: A @ 216.198.79.1 (Vercel)
- Proxy: DNS only

CNAME www:
- BEFORE: CNAME www oyarzun.com
- AFTER: CNAME www 7f488413b101f54b.vercel-dns-017.com
- Proxy: DNS only

Deleted duplicate A record:
- DELETED: A @ 192.124.249.20 (could not delete in GoDaddy, deleted in Cloudflare)

### Why Cloudflare
- GoDaddy AutoSSL not available on account
- Self-signed cert errors on all subdomains
- Cloudflare provides free SSL for all proxied records automatically
- Easier DNS management than GoDaddy interface
- Free CDN and DDoS protection included
- Duplicate A record easily deleted in Cloudflare

### Vercel Setup
- oyarzun.com added to Vercel project domain list
- www.oyarzun.com added to Vercel project domain list
- Vercel handles SSL automatically for both
- Next.js app deployed and live

---

## 2. THEHOUSEKEEPER.BIZ — Made Independent

### Problem
Domain was a masked forward pointing to www.oyarzun.com/thehousekeeper/. This broke when oyarzun.com moved to Vercel. Files existed at public_html/thehousekeeper/ but had no independent hosting setup.

### Site Type
Simple HTML and PHP site. Managed by dad (Tomas Oyarzun Sr.) via GoDaddy cPanel File Manager.

### Files
- Copied FROM: public_html/thehousekeeper/
- Copied TO: public_html/thehousekeeper.biz/
- Files include: resources/ sections/ .htaccess index.php thk_log_de_cambios
- Old folder public_html/thehousekeeper/ left in place as backup

### cPanel
- Added thehousekeeper.biz as Addon Domain
- Document Root: public_html/thehousekeeper.biz
- Internal subdomain created: thehousekeeper.oyarzun.com (required by cPanel for addon domains — invisible to visitors)

### DNS in GoDaddy
- Removed: Domain forward and masking to oyarzun.com/thehousekeeper/
- A @ 160.153.78.169
- CNAME www thehousekeeper.biz

### SSL via Cloudflare
- Added thehousekeeper.biz as separate site in Cloudflare
- SSL Mode: Full (not Full Strict — GoDaddy has self-signed cert on server)
- Always Use HTTPS: ON
- Automatic HTTPS Rewrites: ON
- All email CNAMEs set to DNS only: autodiscover email imap smtp pop webmail mobilemail pda e sip lyncdiscover msoid ftp

### Management Going Forward
- Dad logs into GoDaddy cPanel
- File Manager navigates to public_html/thehousekeeper.biz/
- Upload and edit files there directly

### Still To Do
- Update browser tab title in index.php
- Find: the housekeeper08_v3 current
- Replace with: The Housekeeper
- Check all other PHP pages for same title tag issue

---

## 3. TOMAS.OYARZUN.COM — Preserved Old Oyarzun Site

### Problem
Old oyarzun.com site (dad's graphic design portfolio built in PHP) lived at public_html/ root. When www.oyarzun.com moved to Vercel the old site would have been completely lost without preservation.

### Files
- No files moved — already at public_html/ root
- Site is a PHP application using GET parameters for navigation
- Example URL: tomas.oyarzun.com/index.php?section=Print

### PHP Files Fixed
File: public_html/index.php
Changed all iframe src references from www.oyarzun.com to tomas.oyarzun.com

Three specific changes made:
- BEFORE: http://www.oyarzun.com/myjfmp3/index.php
- AFTER: http://tomas.oyarzun.com/myjfmp3/index.php

- BEFORE: http://www.oyarzun.com/en/samples/logos/index.html
- AFTER: http://tomas.oyarzun.com/en/samples/logos/index.html

- BEFORE: http://www.oyarzun.com/en/samples/ plus subsection plus /index.html
- AFTER: http://tomas.oyarzun.com/en/samples/ plus subsection plus /index.html

### Known Issues
- Flash Player content in Print/samples section no longer works
- Adobe Flash was discontinued December 2020
- No modern browser supports Flash
- Content is preserved but not viewable
- Decision made to leave as-is since it is an archive

### DNS in Cloudflare
- A tomas 160.153.78.169
- Proxy: Proxied (required for Cloudflare SSL)

### SSL
- Cloudflare SSL Mode: Flexible
- Full mode not possible because GoDaddy server has self-signed cert
- Flexible means visitor to Cloudflare is encrypted, Cloudflare to GoDaddy is not
- Acceptable for personal archive site

---

## 4. SALTLAKECITYJUDO.ORG — Fixed WordPress Site

### Problem
Domain was a 302 temporary forward pointing to http://www.oyarzun.com/blog/. WordPress files existed at public_html/blog/. When oyarzun.com moved to Vercel the judo site accidentally showed the new Vercel blog. All WordPress database URLs were hardcoded to oyarzun.com/blog causing broken images videos and links.

### Site Type
WordPress site. Built by dad (Tomas Oyarzun Sr.) for Salt Lake City Judo Club sensei. Plan is to hand over to sensei when ready.

### cPanel
- Added saltlakecityjudo.org as Addon Domain
- Document Root: public_html/blog (files stayed in place — no moving needed)

### DNS in GoDaddy
- Removed: 302 forward to http://www.oyarzun.com/blog/
- A @ 160.153.78.169 (already existed — no change needed)
- CNAME www saltlakecityjudo.org (already existed — no change needed)

### WordPress .htaccess
File: public_html/blog/.htaccess

BEFORE:
RewriteBase /blog/
RewriteRule . /blog/index.php [L]

AFTER:
RewriteBase /
RewriteRule . /index.php [L]

Reason: Site is now served as root domain not subfolder

### WordPress Database Changes
Database: oya1328511301039
Table prefix: wp_

wp_options table:
- siteurl changed to http://saltlakecityjudo.org
- home added as http://saltlakecityjudo.org

wp_posts table URL replacements:
- http://www.oyarzun.com/blog replaced with http://saltlakecityjudo.org — 632 rows
- http://oyarzun.com/blog replaced with http://saltlakecityjudo.org — 632 rows
- http://www.oyarzun.com/ replaced with http://saltlakecityjudo.org/ — 23 rows
- http%3A%2F%2Foyarzun.com%2Fblog%2F replaced with http%3A%2F%2Fsaltlakecityjudo.org%2F — URL encoded PDF viewer references
- http%3A%2F%2Fwww.oyarzun.com%2Fblog%2F replaced with http%3A%2F%2Fsaltlakecityjudo.org%2F — URL encoded references
- http%3A%2F%2Fwww.oyarzun.com%2F replaced with http%3A%2F%2Fsaltlakecityjudo.org%2F — Facebook encoded URLs
- http://www.oyarzun.com/JUDO replaced with http://tomas.oyarzun.com/JUDO — video file reference — 4 rows

wp_posts guid column:
- http://oyarzun.com/blog replaced with http://saltlakecityjudo.org — 1236 rows

wp_postmeta table:
- http://oyarzun.com/blog replaced with http://saltlakecityjudo.org — 1 row

wp_options table additional:
- http://oyarzun.com/blog replaced with http://saltlakecityjudo.org — excluding siteurl and home rows

### Media Files Moved
- JUDO Explained [720p].mp4 moved from public_html/ to public_html/blog/
- Database reference updated to http://saltlakecityjudo.org/JUDO Explained [720p].mp4

### WordPress Menu Fixed
- Primary Menu was NULL causing theme to show auto-generated fallback navigation
- This caused duplicate Home and Blog tabs in navigation
- Used Wayback Machine to restore original menu structure
- Created new clean menu matching original site navigation
- Assigned new menu as Primary Menu in Manage Locations

### WordPress Admin
- URL: http://saltlakecityjudo.org/wp-admin
- Username: taoz50
- Password: M2H3HP!hzU)GoCVP 

### Handover Plan (Not Completed)
- Update WordPress core and all plugins before handover
- Create new admin account for judo sensei
- Brief sensei on WordPress management
- Transfer domain ownership if needed

### Still To Do
- Update WordPress 7.0.2 to latest version
- Update all 10 pending plugin updates
- Set up DKIM for saltlakecityjudo-org domain if needed
- Create admin account for judo sensei
- Brief sensei on site management

---

## 5. EMAIL — Microsoft 365 for oyarzun.com

### Problem
After moving oyarzun.com DNS to Cloudflare the SPF record was still pointing to GoDaddy email servers instead of Microsoft 365. This caused outgoing email to fail for some family members including coralia@oyarzun.com. tommy@oyarzun.com worked due to cached connections but was at risk.

### Email Provider
Microsoft 365 / Exchange Online
Tenant: NETORGFT9679468.onmicrosoft.com

### DNS Changes in Cloudflare

SPF TXT Record:
- BEFORE: v=spf1 include:secureserver.net -all
- AFTER: v=spf1 include:spf.protection.outlook.com -all

MX Record (confirmed correct — no change needed):
- oyarzun-com.mail.protection.outlook.com priority 0
- Proxy: DNS only

Microsoft Verification TXT (confirmed correct — no change needed):
- NETORGFT9679468.onmicrosoft.com
- Proxy: DNS only

All email CNAMEs set to DNS only:
- autodiscover autodiscover.outlook.com
- email email.secureserver.net
- imap imap.secureserver.net
- smtp smtp.secureserver.net
- pop pop.secureserver.net
- webmail webmail.secureserver.net
- mobilemail mobilemail-v01.prod.mesa1.secureserver.net
- msoid clientconfig.microsoftonline-p.net
- lyncdiscover webdir.online.lync.com
- sip sipdir.online.lync.com
- ftp sucuriip.oyarzun.com
- _domainconnect _domainconnect.gd.domaincontrol.com (changed from Proxied to DNS only)

SRV Records (confirmed correct — DNS only):
- _sip._tls 100 1 443 sipdir.online.lync.com
- _sipfederationtls._tcp 100 1 5061 sipfed.online.lync.com

### Still To Do
- Set up DKIM in Microsoft 365 admin
  - Go to security.microsoft.com
  - Email and Collaboration — Policies and Rules — Threat Policies — DKIM
  - Find oyarzun.com
  - Enable DKIM signing
  - Copy the two selector CNAME records provided
  - Add both to Cloudflare DNS as DNS only
  - selector1._domainkey
  - selector2._domainkey
  - Return to Microsoft 365 and click Enable
- Add DMARC record in Cloudflare
  - Type: TXT
  - Name: _dmarc
  - Value: v=DMARC1; p=none; rua=mailto:tommy@oyarzun.com
  - Proxy: DNS only
  - Start with p=none (monitor only) then tighten later

---

## 6. ALL SUBDOMAINS — Preserved in Cloudflare

### Problem
After moving oyarzun.com nameservers to Cloudflare all subdomain DNS records needed to be recreated in Cloudflare. Some were imported automatically, others added manually.

### Subdomains Added Manually in Cloudflare

All point to GoDaddy hosting and set to Proxied for free Cloudflare SSL:
- A esperanza 160.153.78.169 Proxied
- A fotos 160.153.78.169 Proxied
- A mike 160.153.78.169 Proxied
- A tommy 160.153.78.169 Proxied
- A tomas 160.153.78.169 Proxied
- A upload 160.153.78.169 Proxied
- A sucuriip 50.63.51.1 Proxied

---

## Complete DNS Reference

### oyarzun.com — Managed by Cloudflare

A Records:
- A @ 216.198.79.1 DNS only (Vercel)
- A tomas 160.153.78.169 Proxied
- A tommy 160.153.78.169 Proxied
- A esperanza 160.153.78.169 Proxied
- A fotos 160.153.78.169 Proxied
- A mike 160.153.78.169 Proxied
- A upload 160.153.78.169 Proxied
- A sucuriip 50.63.51.1 Proxied

CNAME Records:
- CNAME www 7f488413b101f54b.vercel-dns-017.com DNS only
- CNAME autodiscover autodiscover.outlook.com DNS only
- CNAME email email.secureserver.net DNS only
- CNAME imap imap.secureserver.net DNS only
- CNAME smtp smtp.secureserver.net DNS only
- CNAME pop pop.secureserver.net DNS only
- CNAME webmail webmail.secureserver.net DNS only
- CNAME mobilemail mobilemail-v01.prod.mesa1.secureserver.net DNS only
- CNAME msoid clientconfig.microsoftonline-p.net DNS only
- CNAME lyncdiscover webdir.online.lync.com DNS only
- CNAME sip sipdir.online.lync.com DNS only
- CNAME _domainconnect _domainconnect.gd.domaincontrol.com DNS only
- CNAME e email.secureserver.net DNS only
- CNAME ftp sucuriip.oyarzun.com DNS only

MX Records:
- MX @ oyarzun-com.mail.protection.outlook.com priority 0 DNS only

TXT Records:
- TXT @ v=spf1 include:spf.protection.outlook.com -all DNS only
- TXT @ NETORGFT9679468.onmicrosoft.com DNS only
- TXT _dmarc v=DMARC1; p=none; rua=mailto:tommy@oyarzun.com DNS only (TO ADD)

SRV Records:
- SRV _sip._tls 100 1 443 sipdir.online.lync.com DNS only
- SRV _sipfederationtls._tcp 100 1 5061 sipfed.online.lync.com DNS only

DKIM Records (TO ADD after Microsoft 365 setup):
- CNAME selector1._domainkey [value from Microsoft 365] DNS only
- CNAME selector2._domainkey [value from Microsoft 365] DNS only

### thehousekeeper.biz — Managed by Cloudflare

A Records:
- A @ 160.153.78.169 Proxied
- A admin 160.153.78.169 Proxied
- A mail 160.153.78.169 Proxied

CNAME Records:
- CNAME www thehousekeeper.biz Proxied
- CNAME autodiscover autodiscover.outlook.com DNS only
- CNAME email email.secureserver.net DNS only
- CNAME imap imap.secureserver.net DNS only
- CNAME smtp smtp.secureserver.net DNS only
- CNAME pop pop.secureserver.net DNS only
- CNAME webmail webmail.secureserver.net DNS only
- CNAME mobilemail mobilemail-v01.prod.mesa1.secureserver.net DNS only

MX Records:
- MX @ mailstore1.secureserver.net priority 10 DNS only
- MX @ smtp.secureserver.net priority 0 DNS only

### saltlakecityjudo.org — Managed by GoDaddy DNS

A Records:
- A @ 160.153.78.169
- A admin 160.153.78.169
- A mail 160.153.78.169

CNAME Records:
- CNAME www saltlakecityjudo.org
- CNAME autodiscover autodiscover.outlook.com

MX Records:
- MX @ saltlakecityjudo-org.mail.protection.outlook.com priority 0

TXT Records:
- TXT @ NETORGFT9679468.onmicrosoft.com
- TXT @ v=spf1 include:secureserver.net -all

SRV Records:
- SRV _sip._tls 100 1 443 sipdir.online.lync.com
- SRV _sipfederationtls._tcp 100 1 5061 sipfed.online.lync.com

---

## File Structure Reference

```
/home/zo81zqz6hc1h/
|
+-- public_html/                         (tomas.oyarzun.com old site)
    |
    +-- index.php                        (main PHP app with GET params)
    +-- .htaccess                        (tomas.oyarzun.com rules)
    |
    +-- en/
    |   +-- resources/
    |       +-- filetostring.php
    |       +-- filetostring-menu.php
    |       +-- filetostring-rightbox.php
    |       +-- rightbox-torres.inc
    |
    +-- myjfmp3/                         (mp3 player)
    |
    +-- blog/                            (saltlakecityjudo.org WordPress)
    |   +-- index.php
    |   +-- .htaccess                    (fixed RewriteBase from /blog/ to /)
    |   +-- wp-admin/
    |   +-- wp-content/
    |   +-- wp-includes/
    |   +-- wp-config.php               (DB: oya1328511301039)
    |   +-- JUDO Explained 720p.mp4     (moved from public_html/ root)
    |
    +-- thehousekeeper/                  (OLD BACKUP can delete when confident)
    |   +-- index.php
    |   +-- resources/
    |   +-- sections/
    |
    +-- thehousekeeper.biz/              (thehousekeeper.biz ACTIVE)
        +-- index.php
        +-- .htaccess
        +-- resources/
        +-- sections/
```


---

## Remaining Tasks

### High Priority
- [ ] Set up DKIM in Microsoft 365 for oyarzun.com email
- [ ] Add DMARC TXT record in Cloudflare for oyarzun.com
- [ ] Update WordPress core on saltlakecityjudo.org (7.0.2 available)
- [ ] Update all 10 pending plugins on saltlakecityjudo.org

### Medium Priority
- [ ] Update browser tab title on thehousekeeper.biz
- [ ] Test all oyarzun.com subdomains SSL working without VPN
- [ ] Create admin account for judo sensei on saltlakecityjudo.org
- [ ] Brief sensei on WordPress management

### Low Priority / Future
- [ ] Delete old public_html/thehousekeeper/ backup folder when confident
- [ ] Update SPF record on saltlakecityjudo.org to Microsoft 365
- [ ] Add DMARC record for saltlakecityjudo.org
- [ ] Transfer saltlakecityjudo.org domain to sensei when ready
- [ ] Tighten DMARC policy from p=none to p=quarantine after monitoring

---

## Quick Reference — Who Manages What

| Site | Manager | How They Access |
|------|---------|-----------------|
| www.oyarzun.com | Tommy and wife | Vercel dashboard + GitHub |
| tomas.oyarzun.com | Dad (read only archive) | GoDaddy cPanel public_html/ |
| thehousekeeper.biz | Dad | GoDaddy cPanel public_html/thehousekeeper.biz/ |
| saltlakecityjudo.org | Tommy until handover | WordPress admin /wp-admin |
| All DNS (oyarzun.com) | Tommy | Cloudflare dashboard |
| All DNS (thehousekeeper.biz) | Tommy | Cloudflare dashboard |
| All DNS (saltlakecityjudo.org) | Tommy | GoDaddy DNS |
| Email (oyarzun.com) | Tommy | Microsoft 365 admin.microsoft.com |

---

## Credentials Reference (store securely — do not commit to public repo)

- GoDaddy Account: [store in password manager]
- Cloudflare Account: [store in password manager]
- Vercel Account: [store in password manager]
- Microsoft 365 Admin: admin.microsoft.com [store in password manager]
- WordPress Admin saltlakecityjudo.org: [store in password manager]
- GoDaddy cPanel Username: zo81zqz6hc1h (partial — verify full username)

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026 | Moved oyarzun.com DNS to Cloudflare nameservers | GoDaddy AutoSSL not available, needed SSL for subdomains |
| 2026 | Pointed oyarzun.com to Vercel | New Next.js site deployed |
| 2026 | Added tomas.oyarzun.com subdomain | Preserve old oyarzun.com site |
| 2026 | Fixed tomas.oyarzun.com PHP iframes | iframes referenced www.oyarzun.com which moved to Vercel |
| 2026 | Made thehousekeeper.biz independent addon domain | Was masked forward, broke when oyarzun.com moved to Vercel |
| 2026 | Added thehousekeeper.biz to Cloudflare | Free SSL, replaces broken GoDaddy self-signed cert |
| 2026 | Fixed saltlakecityjudo.org WordPress | Was masked forward, broke when oyarzun.com moved to Vercel |
| 2026 | Updated 1800+ WordPress database URLs | All URLs hardcoded to oyarzun.com/blog, needed updating |
| 2026 | Fixed WordPress .htaccess RewriteBase | Was /blog/ subfolder, now root domain |
| 2026 | Fixed WordPress Primary Menu | Was NULL causing theme fallback duplicate navigation |
| 2026 | Updated SPF record to Microsoft 365 | Was pointing to GoDaddy servers, broke outgoing email |
| 2026 | Set all email CNAMEs to DNS only | Proxied email records break email routing |
| 2026 | Deleted duplicate A record 192.124.249.20 | Conflicting record blocking Vercel validation |
| 2026 | Moved JUDO video file to public_html/blog/ | Video referenced from WordPress, needed to be on same domain |
