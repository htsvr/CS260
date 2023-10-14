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
### Comments
&lt;!-- commented text --&gt;  
### Special Characters  
|Character|Entity|
|:---:|:---:|
|&amp;|&amp;amp;|
|&lt;|&amp;lt;|
|&gt;|&amp;gt;|
|&quot;|&amp;quot;|
|&apos;|&amp;apos;|
|&#128056;|&amp;#128056;|  

## CSS
### CSS Declarations
| Property           | Value                              | Example             | Discussion                                                                     |
| ------------------ | ---------------------------------- | ------------------- | ------------------------------------------------------------------------------ |
| background-color   | color                              | `red`               | Fill the background color                                                      |
| border             | color width style                  | `#fad solid medium` | Sets the border using shorthand where any or all of the values may be provided |
| border-radius      | unit                               | `50%`               | The size of the border radius                                                  |
| box-shadow         | x-offset y-offset blu-radius color | `2px 2px 2px gray`  | Creates a shadow                                                               |
| columns            | number                             | `3`                 | Number of textual columns                                                      |
| column-rule        | color width style                  | `solid thin black`  | Sets the border used between columns using border shorthand                    |
| color              | color                              | `rgb(128, 0, 0)`    | Sets the text color                                                            |
| cursor             | type                               | `grab`              | Sets the cursor to display when hovering over the element                      |
| display            | type                               | `none`              | Defines how to display the element and its children                            |
| filter             | filter-function                    | `grayscale(30%)`    | Applies a visual filter                                                        |
| float              | direction                          | `right`             | Places the element to the left or right in the flow                            |
| flex               |                                    |                     | Flex layout. Used for responsive design                                        |
| font               | family size style                  | `Arial 1.2em bold`  | Defines the text font using shorthand                                          |
| grid               |                                    |                     | Grid layout. Used for responsive design                                        |
| height             | unit                               | `.25em`             | Sets the height of the box                                                     |
| margin             | unit                               | `5px 5px 0 0`       | Sets the margin spacing                                                        |
| max-[width/height] | unit                               | `20%`               | Restricts the width or height to no more than the unit                         |
| min-[width/height] | unit                               | `10vh`              | Restricts the width or height to no less than the unit                         |
| opacity            | number                             | `.9`                | Sets how opaque the element is                                                 |
| overflow           | [visible/hidden/scroll/auto]       | `scroll`            | Defines what happens when the content does not fix in its box                  |
| position           | [static/relative/absolute/sticky]  | `absolute`          | Defines how the element is positioned in the document                          |
| padding            | unit                               | `1em 2em`           | Sets the padding spacing                                                       |
| left               | unit                               | `10rem`             | The horizontal value of a positioned element                                   |
| text-align         | [start/end/center/justify]         | `end`               | Defines how the text is aligned in the element                                 |
| top                | unit                               | `50px`              | The vertical value of a positioned element                                     |
| transform          | transform-function                 | `rotate(0.5turn)`   | Applies a transformation to the element                                        |
| width              | unit                               | `25vmin`            | Sets the width of the box                                                      |
| z-index            | number                             | `100`               | Controls the positioning of the element on the z axis                          |

### Units
| Unit | Description                                                      |
| ---- | ---------------------------------------------------------------- |
| px   | The number of pixels                                             |
| pt   | The number of points (1/72 of an inch)                           |
| in   | The number of inches                                             |
| cm   | The number of centimeters                                        |
| %    | A percentage of the parent element                               |
| em   | A multiplier of the width of the letter `m` in the parent's font |
| rem  | A multiplier of the width of the letter `m` in the root's font   |
| ex   | A multiplier of the height of the element's font                 |
| vw   | A percentage of the viewport's width                             |
| vh   | A percentage of the viewport's height                            |
| vmin | A percentage of the viewport's smaller dimension                 |
| vmax | A percentage of the viewport's larger dimension                  |

