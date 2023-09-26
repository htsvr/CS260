### Text Formating
- Bold: \*\* \*\* or \_\_ \_\_
- Italic: \* \* or \_ \_
- Strikethrough: \~\~ \~\~
- Inline Code: \` \`
- Code Blocks: \`\`\` \`\`\`
- Tables:
    |Syntax| Description|
    |:---:|:---|
    |Header|Title|
    |Paragraph|Text|

## Web Server
### SSH
`ssh -i [key pair file] ubuntu@[ip address]`

If you get a warning that your key pair file permissions are too open run the `chmod` command:

```chmod 600 [key pair file]```

## HTML  
Name the main HTML file for your web application `index.html`.  
### Common Elements
|element|meaning|
|:---:|:---:|
|`html`|The page container|
|`head`|Header information|
|`title`|Title of the page|
|`meta`|Metadata for the page such as character set of veiwport settings|
|`script`|JavaScript reference. Either an external reference, or inline|
|`include`|External content reference|
|`body`|The entire content body of the page|
|`header`|Header of the main content|
|`footer`|Footer of the main content|
|`nav`|Navigational inputs|
|`main`|Main content of the page|
|`section`|A section of the main content|
|`aside`|Aside content from the main content|
|`div`|A block division of content|
|`span`|An inline span of content|
`h<1-9>`|Text heading. From h1, the highest level, down to h9, the lowest level|
|`p`|A paragraph of text|
|`b`|Bring attention|
|`table`|Table|
|`tr`|Table row|
|`th`|Table header|
|`td`|Table data|
|`ol`, `ul`| Ordered or unordered list|
|`li`|List item|
|`a`|Anchor the text to a hyperlink|
|`img`|Graphical image reference|
|`dialog`|Interactive component such as a confirmation|
|`form`|A collection of user input|
|`input`|User input field|
|`audio`|Audio content|
|`video`|Video content|
|`svg`| Scalable vector graphic content|
|`iframe`|Inline fram of another HTML page|  
## Comments
&lt;!-- commented text --&gt;  
## Special Characters  
|Character|Entity|
|:---:|:---:|
|&amp;|&amp;amp;|
|&lt;|&amp;lt;|
|&gt;|&amp;gt;|
|&quot;|&amp;quot;|
|&apos;|&amp;apos;|
|&#128056;|&amp;#128056;|  
