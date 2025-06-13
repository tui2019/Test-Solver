# Test-Solver

> **Note:** This README file was mostly written by AI. If you have any further questions, feel free to open an [issue](https://github.com/tui2019/Test-Solver/issues) on this GitHub repo.

## About

Test-Solver is a browser extension designed to help solve tests automatically. Originally created for personal use, this project is now being opened up to the community for collaboration and improvement.

## Description

This extension will solve the test for you. It was initially developed as a personal tool to automate the process of solving certain types of tests, but I believe it could be valuable to others with similar needs.

## Features

- Automated test solving
- Browser extension format
- Works on desktop browsers and Android (tested)
- Firefox-focused: best experience and most thoroughly tested on Firefox (desktop and Android)
- Simple user interface
- No dependencies required
- Support for 2 API keys for increased request limit

### Mobile Support

- **Android:** The extension works well on Firefox for Android.  
  To install extensions on Firefox for Android, you need to enable "Install extension from files". To do this:
  1. Open Firefox for Android.
  2. Go to **Settings > About Firefox**.
  3. Tap the Firefox logo multiple times until the developer options are enabled.
  4. You can then load custom extensions through the "Install extension from files" section in the add-ons menu.
- **iOS:** I was unable to run the extension on iOS using the Orion browser, which is currently the most likely way to run browser extensions on iOS. This is probably due to some timing issue, but I do not have an iPhone to investigate it further.
  - If you have an iPhone and some JavaScript knowledge, feel free to try fixing this issue—contributions are welcome!

## Installation

The recommended way to install Test-Solver is by downloading the latest release from the [Releases page](https://github.com/tui2019/Test-Solver/releases).

1. Go to the [Releases page](https://github.com/tui2019/Test-Solver/releases).
2. Download the latest packaged extension files.
3. Follow the provided instructions for your browser to load the unpacked extension.

### Building from Source

If you want to build the extension yourself, you can use the provided `archive.sh` script:

```bash
# Clone the repository
git clone https://github.com/tui2019/Test-Solver.git

# Navigate to the project directory
cd Test-Solver

# Run the archive script to build the extension package
sh archive.sh
```

> **Note:** If you want to use a signed .xpi file on Firefox for Android, you will need to submit your build to the [Firefox Developer Hub](https://addons.mozilla.org/en-US/developers/) for signing.

## Usage

1. Install the extension in your browser (see Installation section).
2. Navigate to the test page you want to solve.
3. Click the extension icon to activate.
4. Follow the on-screen instructions.

## Contributing

Although this project started as a personal tool, contributions are welcome! If you'd like to contribute:

- Adding support for new test platforms is relatively easy, and contributions in this area are encouraged.
- If you know JavaScript:
  1. Fork the repository.
  2. Create a feature branch (`git checkout -b feature/amazing-feature`).
  3. Commit your changes (`git commit -m 'Add some amazing feature'`).
  4. Push to the branch (`git push origin feature/amazing-feature`).
  5. Open a Pull Request.
- If you do not know JavaScript, you can open an [issue](https://github.com/tui2019/Test-Solver/issues) describing the platform or feature you want supported. If the issue gets enough support or interest from others, I might implement it myself!
- If you have an iPhone and some JavaScript knowledge, your help with iOS compatibility would be especially appreciated!

## License

This project is licensed under the MIT License – see the LICENSE file for details.

## Disclaimer

This tool is meant for educational purposes only. Please respect academic integrity policies and terms of service for any platforms where you use this extension.
