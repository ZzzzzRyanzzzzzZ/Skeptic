# Skeptic browser extension

Adds **"Check … with Skeptic"** to the right-click menu. Select a suspicious
message anywhere — webmail, a social feed, a support ticket — and the selection
opens in the analyser.

## Loading it

Chrome, Edge, Brave, or any Chromium browser:

1. Visit `chrome://extensions`
2. Turn on **Developer mode**
3. **Load unpacked**, and choose this `extension/` folder

Firefox uses the same manifest format for this feature set; load it from
`about:debugging` → **This Firefox** → **Load Temporary Add-on**.

## What it can and cannot see

It requests exactly one permission, `contextMenus`. It has no host permissions,
no content scripts, and cannot read any page — the browser hands it the text you
selected, and nothing else.

The selection is passed to the app in the URL **fragment** (`#m=…`), which
browsers never send to a server. Combined with the app running its detection
entirely in the page, the message never reaches any network.

The app strips the fragment from the address bar as soon as it reads it, so the
message does not linger in history or in a link you might share.
