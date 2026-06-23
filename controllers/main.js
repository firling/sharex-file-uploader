const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const sanitizeHtml = require('sanitize-html');

const renderMarkdownPage = (filename, body) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${filename}</title>
<style>
  body { max-width: 820px; margin: 2rem auto; padding: 0 1rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6; color: #1a1a1a; }
  h1, h2, h3 { line-height: 1.25; }
  h1, h2 { border-bottom: 1px solid #eaecef; padding-bottom: .3em; }
  a { color: #0969da; }
  code { background: #f6f8fa; padding: .2em .4em; border-radius: 6px; font-size: 85%; }
  pre { background: #f6f8fa; padding: 1rem; border-radius: 6px; overflow: auto; }
  pre code { background: none; padding: 0; }
  blockquote { color: #57606a; border-left: .25em solid #d0d7de; margin: 0; padding: 0 1em; }
  img { max-width: 100%; }
  table { border-collapse: collapse; }
  th, td { border: 1px solid #d0d7de; padding: 6px 13px; }
  @media (prefers-color-scheme: dark) {
    body { background: #0d1117; color: #c9d1d9; }
    h1, h2 { border-bottom-color: #21262d; }
    a { color: #58a6ff; }
    code, pre { background: #161b22; }
    blockquote { color: #8b949e; border-left-color: #30363d; }
    th, td { border-color: #30363d; }
  }
</style>
</head>
<body>
${body}
</body>
</html>`;

const postFile = (req, res) => {

    var url = "";
    if (req.body.secret != process.env.SECRET) url = "wrong secret";
    else url = `${process.env.URL}/static/${req.filename}`;

    console.log(url);

    return res.status(200).json({
        success: true,
        url,
    });
}

const getAllFile = (req, res) => {
    fs.readdir('./files', (err, files) => {
        if (err) return res.status(500).json({ success: false, error: err });
        return res.status(200).json({ success: true, files });
    });
}

const deleteFile = (req, res) => {
    fs.unlink(`./files/${req.params.filename}`, (err) => {
        if (err) return res.status(500).json({ success: false, error: err });
        return res.status(200).json({ success: true });
    });
}

const uploadFile = (req, res) => {
    if (!req.filename) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    return res.status(200).json({ success: true, filename: req.filename });
}

const viewFile = (req, res) => {
    // basename strips any path-traversal segments from the URL param.
    const filename = path.basename(req.params.filename);
    const ext = path.extname(filename).toLowerCase();

    if (ext !== '.md' && ext !== '.markdown') {
        return res.redirect(`/static/${filename}`);
    }

    fs.readFile(path.join(__dirname, '..', 'files', filename), 'utf8', (err, data) => {
        if (err) return res.status(404).send('Not found');

        const dirty = marked.parse(data);
        const clean = sanitizeHtml(dirty, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                img: ['src', 'alt', 'title'],
                a: ['href', 'name', 'title'],
            },
            allowedSchemes: ['http', 'https', 'mailto'],
        });

        res.set('Content-Type', 'text/html; charset=utf-8');
        return res.send(renderMarkdownPage(filename, clean));
    });
}

module.exports = {
    postFile, getAllFile, deleteFile, uploadFile, viewFile
}
