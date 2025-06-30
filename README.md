# PageProtector Library

![PageProtector Shield](https://img.shields.io/badge/PageProtector-Shield-brightgreen) 
![GitHub license](https://img.shields.io/badge/license-MIT-blue)

A lightweight JavaScript library that protects your web pages against casual inspection and developer tools access. PageProtector adds multiple layers of client-side protection to deter users from viewing or modifying your source code.

## Features

- 🚫 Disable right-click context menu
- ⌨️ Block developer tools keyboard shortcuts (F12, Ctrl+Shift+I, etc.)
- 🔒 Prevent text selection and copying
- 🔍 Tamper detection (auto-reloads page when dev tools are open)
- 🕵️‍♂️ Source code obfuscation
- 📊 Optional protection status indicator
- ⚙️ Fully configurable protection options
- 🧹 Clean destruction method to remove protections

## Installation

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/gh/anupammo/page-protecter@main/page-protector.js"></script>
```

### Local Installation

1. Download the latest version:
```bash
curl -O https://raw.githubusercontent.com/yourusername/page-protector/master/page-protector.js
```

2. Include in your HTML:
```html
<script src="path/to/page-protector.js"></script>
```

## Usage

### Basic Implementation

```html
<script>
  // Initialize with default settings
  const protector = new PageProtector();
  protector.init();
</script>
```

### Advanced Configuration

```javascript
const protector = new PageProtector({
  disableRightClick: true,
  disableShortcuts: true,
  disableTextSelection: false,
  tamperDetection: true,
  obfuscate: true,
  showStatusIndicator: true,
  tamperCheckInterval: 1500,
  tamperThreshold: 150,
  onContextMenuBlocked: function(e) {
    console.log('Context menu blocked', e);
  },
  onShortcutBlocked: function(shortcut) {
    console.log('Blocked shortcut:', shortcut);
  },
  onDevToolsDetected: function() {
    console.log('Dev tools detected!');
  }
}).init();
```

### Auto-Initialization

```html
<head>
  <script>
    // Set auto-init flag before loading the library
    const PAGE_PROTECTOR_AUTO_INIT = true;
  </script>
  <script src="page-protector.js"></script>
</head>
```

## Configuration Options

| Option               | Default | Description                                                                 |
|----------------------|---------|-----------------------------------------------------------------------------|
| `disableRightClick`  | `true`  | Disable right-click context menu                                            |
| `disableShortcuts`   | `true`  | Block developer tools keyboard shortcuts                                    |
| `disableTextSelection`| `true`  | Prevent text selection on the page                                          |
| `tamperDetection`    | `true`  | Detect and reload when dev tools are open                                   |
| `obfuscate`          | `true`  | Add obfuscation comments to source code                                     |
| `showStatusIndicator`| `true`  | Show protection status indicator in corner                                  |
| `tamperCheckInterval`| `1000`  | How often to check for dev tools (milliseconds)                             |
| `tamperThreshold`    | `100`   | Time threshold to detect dev tools (milliseconds)                           |
| `onContextMenuBlocked`| `null`  | Callback when context menu is blocked                                       |
| `onShortcutBlocked`  | `null`  | Callback when a shortcut is blocked                                         |
| `onDevToolsDetected` | `null`  | Callback when dev tools are detected                                        |

## API Methods

### `init()`
Initializes all enabled protection features.

### `destroy()`
Removes all protection features and cleans up event listeners.

### `updateStatus(message)`
Updates the status indicator with a custom message (only if enabled).

## Event Callbacks

### `onContextMenuBlocked(event)`
Triggered when a context menu is blocked.

### `onShortcutBlocked(shortcut)`
Triggered when a keyboard shortcut is blocked. Returns the blocked shortcut name.

### `onDevToolsDetected()`
Triggered when developer tools are detected.

## Security Notes

⚠️ **Important Security Considerations**:

- This library provides client-side protection only
- Determined users can bypass these protections
- Always implement server-side security for sensitive operations
- These protections act as deterrents, not foolproof security
- Do not rely on client-side protection for sensitive logic or data

## Browser Support

PageProtector works on all modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any issues or questions, please [open an issue](https://github.com/yourusername/page-protector/issues).

---

**Disclaimer**: This library makes it more difficult for casual users to inspect your source code, but determined users can still bypass these protections. Always implement proper server-side security measures for sensitive operations.
