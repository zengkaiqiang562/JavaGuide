---
title: 应用资源
category: 
  - android
tag:
  - android
---

> 参考：[应用资源](https://developer.android.google.cn/guide/topics/resources/providing-resources?hl=zh-cn)

## 1. Android 中的资源切换

> 参考：[Android 中的资源切换](https://developer.android.google.cn/guide/topics/resources/localization?hl=zh_cn#resource-switching)

资源是指文本字符串、布局、声音、图形和您的 `Android` 应用需要的任何其他静态数据。

应用可以包含多组资源，每组资源针对不同的设备配置进行定制。当用户运行应用时，`Android` 会自动选择并加载与设备最匹配的资源。

编写应用时，您需要为应用创建默认资源和备用资源。当用户运行您的应用时，`Android` 系统会根据设备的语言区域选择要加载的资源。要创建资源，您需要将文件放在项目的 `res/` 目录下特别命名的子目录中。

## 2. 提供备用资源

> 参考：[提供备用资源](https://developer.android.google.cn/guide/topics/resources/providing-resources?hl=zh-cn#AlternativeResources)

几乎每个应用都应提供备用资源，以便支持特定的设备配置。例如，对于不同的屏幕密度和语言，您应分别加入备用可绘制对象资源和备用字符串资源。在运行时，`Android` 会检测当前设备配置并为应用加载合适的资源。

### 2.1 `res/` 目录中支持的资源目录名称（`resources_name`）

<table border="1" style="font-size:14px">
    <tr>
        <th>目录（<code>resources_name</code>）</th>
        <th>资源类型</th>
    </tr>
    <tr>
        <td><code>animator/</code></td>
        <td>用于定义属性动画的 <code>XML</code> 文件</td>
    </tr>
    <tr>
        <td><code>anim/</code></td>
        <td>用于定义视图动画的 <code>XML</code> 文件。（属性动画也可保存在此目录中，但为了区分这两种类型，属性动画首选 <code>animator/</code> 目录。）</td>
    </tr>
    <tr>
        <td><code>drawable/</code></td>
        <td>位图文件（<code>.png</code>、<code>.9.png</code>、<code>.jpg</code>、<code>.gif</code>）或编译为以下可绘制对象资源子类型的 <code>XML</code> 文件：
            <ol>
                <li>位图文件</li>
                <li>九宫格（可调整大小的位图）</li>
                <li>状态列表</li>
                <li>形状</li>
                <li>动画可绘制对象</li>
                <li>其他可绘制对象</li>
            </ol>
        请参阅 <a target="_blank" href="https://developer.android.google.cn/guide/topics/resources/drawable-resource?hl=zh-cn">Drawable 资源</a>。
        </td>
    </tr>
    <tr>
        <td><code>mipmap/</code></td>
        <td>适用于不同启动器图标密度的可绘制对象文件。</td>
    </tr>
    <tr>
        <td><code>layout/</code></td>
        <td>用于定义用户界面布局的 <code>XML</code> 文件</td>
    </tr>
    <tr>
        <td><code>menu/</code></td>
        <td>
        用于定义应用菜单（如选项菜单、上下文菜单或子菜单）的 <code>XML</code> 文件。请参阅 <a target="_blank" href="https://developer.android.google.cn/guide/topics/resources/menu-resource?hl=zh-cn">菜单资源</a>。
        </td>
    </tr>
    <tr>
        <td><code>raw/</code></td>
        <td>
        需以原始形式保存的任意文件。如要使用原始 <code>InputStream</code> 打开这些资源，<br/>请使用资源 <code>ID</code>（即 <code>R.raw.filename</code>）调用 <code>Resources.openRawResource(int resId)</code>。
        </td>
    </tr>
    <tr>
        <td><code>values/</code></td>
        <td>
        包含字符串、整型数和颜色等简单值的 <code>XML</code> 文件。如：
            <ol>
                <li><code>arrays.xml</code>：资源数组（<a target="_blank" href="https://developer.android.google.cn/guide/topics/resources/more-resources?hl=zh-cn#TypedArray">类型数组</a>）。</li>
                <li><code>colors.xml</code>：<a target="_blank" href="https://developer.android.google.cn/guide/topics/resources/more-resources?hl=zh-cn#Color">颜色值</a>。</li>
                <li><code>dimens.xml</code>：<a target="_blank" href="https://developer.android.google.cn/guide/topics/resources/more-resources?hl=zh-cn#Dimension">尺寸值</a>。</li>
                <li><code>strings.xml</code>：<a target="_blank" href="https://developer.android.google.cn/guide/topics/resources/string-resource?hl=zh-cn">字符串值</a>。</li>
                <li><code>styles.xml</code>：<a target="_blank" href="https://developer.android.google.cn/guide/topics/resources/style-resource?hl=zh-cn">样式</a>。</li>
            </ol>
        </td>
    </tr>
    <tr>
        <td><code>xml/</code></td>
        <td>可在运行时通过调用 <code>Resources.getXML()</code> 读取的任意 <code>XML</code> 文件。</td>
    </tr>
    <tr>
        <td><code>font/</code></td>
        <td>
        带有扩展名的字体文件（如 <code>.ttf</code>、<code>.otf</code> 或 <code>.ttc</code>），或包含 <code>&lt;font-family&gt;</code> 元素的 <code>XML</code> 文件。<br/>如需详细了解作为资源的字体，请参阅 <a target="_blank" href="https://developer.android.google.cn/guide/topics/ui/look-and-feel/fonts-in-xml?hl=zh-cn">XML 中的字体。</a>
        </td>
    </tr>
</table>

### 2.2 资源的配置限定符

<table border="1" style="font-size:14px">
    <tr>
        <th>配置</th>
        <th>限定符</th>
        <th>描述</th>
    </tr>
    <tr>
        <td>MCC 和 MNC</td>
        <td>
            示例：<br/>
            mcc310<br/>
            mcc310-mnc004<br/>
            mcc208-mnc00<br/>
            等等
        </td>
        <td>
            移动设备国家代码 (MCC)，（可选）后跟设备 SIM 卡中的移动设备网络代码 (MNC)。<br/>
            例如，mcc310 是指美国的任一运营商，mcc310-mnc004 是指美国的 Verizon 公司，mcc208-mnc00 是指法国的 Orange 公司。<br/><br/>
            如果设备使用无线装置连接（GSM 手机），则 MCC 和 MNC 值均来自 SIM 卡。<br/><br/>
            您也可以单独使用 MCC（例如，将国家/地区特定的合法资源加入应用）。<br/>
            如果只需根据语言指定，则改用语言和地区限定符（稍后进行介绍）。<br/>
            如果决定使用 MCC 和 MNC 限定符，请谨慎执行此操作并测试限定符是否按预期工作。<br/><br/>
            另请参阅配置字段 <a href="https://developer.android.google.cn/static/reference/android/content/res/Configuration?hl=zh-cn#mcc">mcc</a> 和 <a href="https://developer.android.google.cn/static/reference/android/content/res/Configuration?hl=zh-cn#mnc">mnc</a>，二者分别表示当前的移动设备国家代码和移动设备网络代码。
        </td>
    </tr>
    <tr>
        <td>语言和区域</td>
        <td>
            示例：<br/>
            en<br/>
            fr<br/>
            zh<br/>
            en-rUS<br/>
            fr-rFR<br/>
            fr-rCA<br/>
            b+en<br/>
            b+en+US<br/>
            b+es+419
        </td>
        <td>
            语言通过由两个字母组成的 <a href="https://www.loc.gov/standards/iso639-2/php/code_list.php">ISO 639-1</a> 语言代码进行定义，<br/>
            可以选择后跟两个字母组成的 <a href="https://www.iso.org/obp/ui/#iso:pub:PUB500001:en">ISO 3166-1-alpha-2</a> 区域码（前缀用小写字母 r）。<br/>
            这些代码不区分大小写；r 前缀用于区分区域码。您不能单独指定区域。<br/><br/>
            Android 7.0（API 级别 24）引入对 <a href="https://tools.ietf.org/html/bcp47">BCP 47</a> 语言标记的支持，可供您用来限定特定语言和区域的资源。<br/>
            语言标记由一个或多个子标记序列组成，每个子标记都能优化或缩小由整体标记标识的语言范围。<br/>
            如需了解有关语言标记的详细信息，请参阅 <a href="https://tools.ietf.org/html/rfc5646">用于标识语言的标记</a>。<br/>
            如要使用 BCP 47 语言标记，请将 b+ 和两个字母的 <a href="http://www.loc.gov/standards/iso639-2/php/code_list.php">ISO 639-1</a> 语言代码连接；其后还可选择使用其他子标记，用 + 分隔即可。<br/><br/>
            另请参阅 <a href="https://developer.android.google.cn/reference/android/content/res/Configuration?hl=zh-cn#getLocales()">getLocales()</a> 方法，了解该方法提供的已定义语言区域列表。此列表包含主要的语言区域。
        </td>
    </tr>
    <tr>
        <td>布局方向</td>
        <td>
            ldrtl<br/>
            ldltr
        </td>
        <td>
            应用的布局方向。<br/>
            ldrtl 是指 “布局方向从右到左”。<br/>
            ldltr 是指 “布局方向从左到右”（默认的隐式值）。<br/><br/>
            请注意：如要为应用启用从右到左的布局功能，则必须将 <a href="https://developer.android.google.cn/guide/topics/manifest/application-element?hl=zh-cn#supportsrtl">supportsRtl</a> 设置为 "true"，并将 <a href="https://developer.android.google.cn/guide/topics/manifest/uses-sdk-element?hl=zh-cn#target">targetSdkVersion</a> 设置为 17 或更高版本。<br/><br/>
            此项为 API 级别 17 中的新增配置。
        </td>
    </tr>
    <tr>
        <td>smallestWidth</td>
        <td>
            <code>sw&lt;N&gt;dp</code><br/><br/>
            示例：<br/>
            sw320dp<br/>
            sw600dp<br/>
            sw720dp<br/>
            等等
        </td>
        <td>
            屏幕的基本尺寸，由可用屏幕区域的最小尺寸指定。<br/>
            具体而言，设备的 smallestWidth 是屏幕可用高度和宽度的最小尺寸（您也可将其视为屏幕的 “最小可能宽度”）。<br/>
            无论屏幕的当前方向如何，您均可使用此限定符确保应用界面的可用宽度至少为 &lt;N&gt; dp。<br/><br/>
            例如：<br/>
            如果布局要求屏幕区域的最小尺寸始终至少为 600dp，则可使用此限定符创建布局资源 res/layout-sw600dp/。仅当可用屏幕的最小尺寸至少为 600dp（无论 600dp 表示的边是用户所认为的高度还是宽度）时，系统才会使用这些资源。<br/>
            最小宽度为设备的固定屏幕尺寸特征；即使屏幕方向发生变化，设备的最小宽度仍会保持不变。<br/><br/>
            使用最小宽度确定一般屏幕尺寸非常有用，因为宽度通常是设计布局时的驱动因素。<br/>
            界面经常会垂直滚动，但对其水平方向所需要的最小空间具有非常硬性的限制。<br/>
            （另外，可用宽度也是确定是否对手持式设备使用单窗格布局，或对平板电脑使用多窗格布局的关键因素。）<br/><br/>
            设备的最小宽度会将屏幕装饰元素和系统界面考虑在内。<br/>
            例如，如果设备屏幕上的某些永久性界面元素沿着最小宽度轴占据空间，则系统会声明最小宽度小于实际屏幕尺寸，因为这些屏幕像素不适用于您的界面。<br/><br/>
            以下是一些可用于常见屏幕尺寸的值：<br/>
            <ul>
                <li>320，适用于屏幕配置如下的设备：
                    <ul>
                        <li>240x320 ldpi（QVGA 手机）</li>
                        <li>320x480 mdpi（手机）</li>
                        <li>480x800 hdpi（高密度手机）</li>
                    </ul></li>
                <li>480，适用于 480x800 mdpi 之类的屏幕（平板电脑/手机）。</li>
                <li>600，适用于 600x1024 mdpi 之类的屏幕（7 英寸平板电脑）。</li>
                <li>720，适用于 720x1280 mdpi 之类的屏幕（10 英寸平板电脑）。</li>
            </ul>
            注意：当应用为多个资源目录提供不同的 smallestWidth 限定符值时，系统会使用最接近（但未超出）设备 smallestWidth 的值。<br/><br/>
            此项为 API 级别 13 中的新增配置。<br/><br/>
            另请参阅：<br/>
            <a href="https://developer.android.google.cn/guide/topics/manifest/supports-screens-element?hl=zh-cn#requiresSmallest">android:requiresSmallestWidthDp</a> 属性（声明与应用兼容的最小 smallestWidth）<br/>
            <a href="https://developer.android.google.cn/reference/android/content/res/Configuration?hl=zh-cn#smallestScreenWidthDp">smallestScreenWidthDp</a> 配置字段（存放设备的 smallestWidth 值）。
        </td>
    </tr>
    <tr>
        <td>可用宽度</td>
        <td>
            w&lt;N&gt;dp<br/><br/>
            示例：<br/>
            w720dp<br/>
            w1024dp<br/>
            等等
        </td>
        <td>
            指定资源应使用的最小可用屏幕宽度（以 dp 为单位，由 &lt;N&gt; 值定义）。<br/>
            当屏幕方向在横向和纵向之间切换时，此配置值也会随之变化，以匹配当前的实际宽度。<br/><br/>
            此功能往往有助于确定是否使用多窗格布局，因为即便在使用平板电脑设备时，您通常也不希望竖屏以横屏的方式使用多窗格布局。<br/>
            因此，您可以使用此功能指定布局所需的最小宽度，而无需同时使用屏幕尺寸和屏幕方向限定符。<br/><br/>
            应用为此配置提供具有不同值的多个资源目录时，系统会使用最接近（但未超出）设备当前屏幕宽度的值。<br/>
            此处的值会考虑屏幕装饰元素，因此如果设备显示屏的左边缘或右边缘上有一些永久性 UI 元素，考虑到这些 UI 元素，同时为减少应用的可用空间，设备会使用小于实际屏幕尺寸的宽度值。<br/><br/>
            此项为 API 级别 13 中的新增配置。<br/><br/>
            另请参阅 <a href="https://developer.android.google.cn/reference/android/content/res/Configuration?hl=zh-cn#screenWidthDp">screenWidthDp</a> 配置字段，该字段存放当前屏幕宽度。
        </td>
    </tr>
    <tr>
        <td>可用高度</td>
        <td>
            h&lt;N&gt;dp<br/><br/>
            示例：<br/>
            h720dp<br/>
            h1024dp<br/>
            等等
        </td>
        <td>
            指定资源应使用的最小可用屏幕高度（以 dp 为单位，由 &lt;N&gt; 值定义）。<br/>
            当屏幕方向在横向和纵向之间切换时，此配置值也会随之变化，以匹配当前的实际高度。<br/><br/>
            对比使用此方式定义布局所需高度与使用 w&lt;N&gt;dp 定义所需宽度，二者均非常有用，且都无需同时使用屏幕尺寸和方向限定符。<br/>
            但大多数应用不需要此限定符，因为界面经常垂直滚动，所以高度需更有弹性，而宽度则应更固定。<br/><br/>
            当应用为此配置提供具有不同值的多个资源目录时，系统会使用最接近（但未超出）设备当前屏幕高度的值。<br/>
            此处的值会考虑屏幕装饰元素，因此如果设备显示屏的上边缘或下边缘上有一些永久性 UI 元素，考虑到这些 UI 元素，同时为减少应用的可用空间，设备会使用小于实际屏幕尺寸的高度值。<br/>
            非固定的屏幕装饰元素（例如，全屏时可隐藏的手机状态栏）并不在考虑范围内，标题栏或操作栏等窗口装饰亦如此，因此应用必须准备好处理稍小于其指定值的空间。<br/><br/>
            此项为 API 级别 13 中的新增配置。<br/><br/>
            另请参阅 <a href="https://developer.android.google.cn/reference/android/content/res/Configuration?hl=zh-cn#screenHeightDp">screenHeightDp</a> 配置字段，该字段存放当前屏幕宽度。
        </td>
    </tr>
    <tr>
        <td>屏幕尺寸</td>
        <td>
            small<br/>
            normal<br/>
            large<br/>
            xlarge
        </td>
        <td>
            <ul>
                <li>small：尺寸类似于低密度 VGA 屏幕的屏幕。小屏幕的最小布局尺寸约为 320x426 dp。<br/>例如，QVGA 低密度屏幕和 VGA 高密度屏幕。</li><br/>
                <li>normal：尺寸类似于中等密度 HVGA 屏幕的屏幕。标准屏幕的最小布局尺寸约为 320x470 dp。<br/>例如，WQVGA 低密度屏幕、HVGA 中等密度屏幕、WVGA 高密度屏幕。</li><br/>
                <li>large：尺寸类似于中等密度 VGA 屏幕的屏幕。大屏幕的最小布局尺寸约为 480x640 dp。<br/>例如，VGA 和 WVGA 中等密度屏幕。</li><br/>
                <li>xlarge：明显大于传统中等密度 HVGA 屏幕的屏幕。超大屏幕的最小布局尺寸约为 720x960 dp。<br/>在大多数情况下，屏幕超大的设备体积太大，不能放进口袋，最常见的是平板式设备。<br/>此项为 API 级别 9 中的新增配置。</li>
            </ul>
            请注意：使用尺寸限定符并不表示资源仅适用于该尺寸的屏幕。如果没有为备用资源提供最符合当前设备配置的限定符，则系统可能会使用其中最匹配的资源。<br/><br/>
            注意：如果所有资源均使用大于当前屏幕的尺寸限定符，则系统不会使用这些资源，并且应用将在运行时崩溃（例如，如果所有布局资源均以 xlarge 限定符标记，但设备是标准尺寸的屏幕）。<br/><br/>
            此项为 API 级别 4 中的新增配置。<br/><br/>
            另请参阅 <a href="https://developer.android.google.cn/reference/android/content/res/Configuration?hl=zh-cn#screenLayout">screenLayout</a> 配置字段，该字段指示屏幕是小尺寸、标准尺寸还是大尺寸。
        </td>
    </tr>
    <tr>
        <td>屏幕纵横比</td>
        <td>
            long<br/>
            notlong
        </td>
        <td>
            <ul>
                <li>long：宽屏，如 WQVGA、WVGA、FWVGA</li>
                <li>notlong：非宽屏，如 QVGA、HVGA 和 VGA</li>
            </ul>
            此项为 API 级别 4 中新增配置。<br/><br/>
            此配置完全基于屏幕的纵横比（宽屏较宽），并且与屏幕方向无关。<br/><br/>
            另请参阅 <a href="https://developer.android.google.cn/reference/android/content/res/Configuration?hl=zh-cn#screenLayout">screenLayout</a> 配置字段，该字段指示屏幕是否为宽屏。
        </td>
    </tr>
    <tr>
        <td>圆形屏幕</td>
        <td>
            round<br/>
            notround
        </td>
        <td>
            <ul>
                <li>round：圆形屏幕，例如圆形可穿戴式设备</li>
                <li>notround：方形屏幕，例如手机或平板电脑</li>
            </ul>
            此项为 API 级别 23 中的新增配置。<br/><br/>
            另请参阅 <a href="https://developer.android.google.cn/reference/android/content/res/Configuration?hl=zh-cn#isScreenRound()">isScreenRound()</a> 配置方法，该方法指示屏幕是否为圆形屏幕。
        </td>
    </tr>
    <tr>
        <td>广色域</td>
        <td>
            widecg<br/>
            nowidecg
        </td>
        <td>
            <ul>
                <li>{@code widecg}：显示广色域，如 Display P3 或 AdobeRGB</li>
                <li>{@code nowidecg}：显示窄色域，如 sRGB</li>
            </ul>
            此项为 API 级别 26 中的新增配置。<br/><br/>
            另请参阅 <a href="https://developer.android.google.cn/reference/android/content/res/Configuration?hl=zh-cn#isScreenWideColorGamut()">isScreenWideColorGamut()</a> 配置方法，该方法指示屏幕是否具有广色域。
        </td>
    </tr>
    <tr>
        <td>高动态范围<br/>(HDR)</td>
        <td>
            highdr<br/>
            lowdr
        </td>
        <td>
            <ul>
                <li>{@code highdr}：显示高动态范围</li>
                <li>{@code lowdr}：显示低/标准动态范围</li>
            </ul>
            此项为 API 级别 26 中的新增配置。<br/><br/>
            另请参阅 <a href="https://developer.android.google.cn/reference/android/content/res/Configuration?hl=zh-cn#isScreenHdr()">isScreenHdr()</a> 配置方法，该方法指示屏幕是否具有 HDR 功能。
        </td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
    </tr>
</table>

## 3. Android 如何查找最佳匹配资源

> 参考：[Android 如何查找最佳匹配资源](https://developer.android.google.cn/guide/topics/resources/providing-resources?hl=zh-cn#BestMatch)

## 4. 屏幕适配

> 参考：[屏幕兼容性概览](https://developer.android.google.cn/guide/practices/screens_support?hl=zh_cn)
> 
> 参考：[支持不同的屏幕尺寸](https://developer.android.google.cn/training/multiscreen/screensizes?hl=zh-cn)

## 5. 本地化（国际化）