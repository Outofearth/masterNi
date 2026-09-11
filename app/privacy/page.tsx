import SiteFooter from '@/components/SiteFooter';
import { SITE_NAME, SITE_FULL_NAME } from '@/lib/site';

export const metadata = {
  title: `隐私政策 · ${SITE_NAME}`,
  description: `${SITE_FULL_NAME} 隐私政策：说明本站如何处理排盘信息、AI 解读请求与本地存储数据。`,
};

const codeStyle = {
  fontSize: 13,
  padding: '1px 6px',
  borderRadius: 4,
  background: 'var(--ac-bg)',
  border: '1px solid var(--ac-bdr)',
  color: 'var(--ac-text)',
} as const;

export default function PrivacyPage() {
  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg-0)', borderBottom: '1px solid var(--bdr)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '15px', color: 'var(--tx-3)', textDecoration: 'none' }}>
          <span style={{ fontSize: '16px' }}>‹</span>
          <span>返回首页</span>
        </a>
        <div style={{ width: '1px', height: '20px', background: 'var(--bdr-med)' }} />
        <span style={{ fontSize: '14px', color: 'var(--ac-text)', letterSpacing: '0.2em' }}>{SITE_NAME}</span>
      </header>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', color: 'var(--tx-1)', lineHeight: 1.8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>隐私政策</h1>
        <p style={{ fontSize: 14, color: 'var(--tx-3)', marginBottom: 24 }}>最后更新：2026 年 9 月</p>

        <p style={{ background: 'var(--ac-bg)', border: '1px solid var(--ac-bdr)', padding: 16, borderRadius: 8, fontSize: 15 }}>
          <strong>一句话说明</strong>：{SITE_NAME}是一个免费、无需注册的紫微斗数排盘与学习工具。
          命盘计算在你的浏览器本地完成，不上传服务器；只有当你主动点击「AI 解读」「合婚分析」或「问天纪」时，
          命盘摘要与你的提问才会被发送给 AI 服务商处理。本站没有账号体系，不收集手机号、支付信息，也不做广告追踪。
        </p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. 我们处理哪些信息</h2>
        <ul style={{ paddingLeft: 24 }}>
          <li><strong>排盘信息</strong>：姓名（选填）、出生公历年月日、出生时辰、性别、出生地经度。这些信息在本浏览器内用于排盘计算，<strong>默认不上传</strong>；不使用 AI 功能时不会离开你的设备。</li>
          <li><strong>AI 交互内容</strong>：当你使用「AI 解读」「合婚分析」「问天纪」时，相关命盘摘要与你输入的文字会经本站服务端转发至 AI 模型服务商处理。服务端只做转发，<strong>不落库保存</strong>。</li>
          <li><strong>浏览器本地存储</strong>：主题偏好、排盘历史、起卦历史、AI 对话记忆等仅保存在你浏览器的 localStorage 中，不会上传（详见第 6 节）。</li>
          <li><strong>匿名访问统计</strong>：由部署平台提供的页面访问量与性能指标（如 Vercel Web Analytics / Speed Insights），仅记录页面路径与加载性能，<strong>不含任何命盘或对话内容</strong>。</li>
          <li><strong>不收集的信息</strong>：本站<strong>没有</strong>注册、登录、会员、短信验证、支付与订单功能，因此不收集手机号、密码、身份证件、银行卡或支付信息。</li>
        </ul>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. 我们如何使用信息</h2>
        <ul style={{ paddingLeft: 24 }}>
          <li>排盘信息仅用于生成你的命盘与解读结果，不使用于任何其他目的。</li>
          <li>AI 交互内容仅用于生成当次回复；请求处理完成后即释放，不写入数据库。</li>
          <li>本站不使用你的数据做用户画像、精准营销或个性化广告。</li>
          <li>不进行跨站追踪，不向第三方出售或交换个人信息。</li>
        </ul>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. 信息共享与第三方</h2>
        <p>除下列情形外，本站不会向第三方提供你的信息：</p>
        <ul style={{ paddingLeft: 24 }}>
          <li><strong>AI 模型服务商</strong>：例如 DeepSeek 等 OpenAI 兼容接口服务商，用于处理 AI 解读 / 合婚 / 问天纪 请求。发送内容为命盘摘要与你的提问本身，不附带可识别身份的信息。</li>
          <li><strong>部署与统计服务商</strong>：静态托管与匿名访问统计（如 Vercel / GitHub Pages），用于让站点可被访问并了解大致访问量。</li>
          <li><strong>法律要求</strong>：应司法机关或政府部门依法提出的合法要求。</li>
        </ul>
        <p>本站<strong>没有</strong>支付服务商、短信服务商、广告联盟或数据分析外包方，因此不存在相关共享。</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. 信息安全</h2>
        <p>本站通过 HTTPS 全程加密传输；站内不保存用户生成内容，服务端仅以环境变量形式持有 AI 服务凭据，不对浏览器暴露。由于本站不存储账号数据，即使发生服务端事故，也不存在可供泄露的命盘资料库。请注意，任何互联网传输都无法保证绝对安全。</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>5. 你的权利</h2>
        <ul style={{ paddingLeft: 24 }}>
          <li><strong>查看与控制</strong>：排盘历史、起卦历史、对话记忆都可在对应页面内查看与删除。</li>
          <li><strong>彻底删除</strong>：清除浏览器本站数据（localStorage）即可删除全部本地记录；本站服务端没有你的账号或内容副本可供查询。</li>
          <li><strong>拒绝 AI</strong>：不使用 AI 功能时，你的排盘信息始终只停留在本地设备。</li>
        </ul>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>6. Cookie 与本地存储</h2>
        <p>本站不使用用于广告或跨站追踪的 Cookie。功能所需的少量数据全部存放在浏览器 localStorage 中，键名如下：</p>
        <ul style={{ paddingLeft: 24 }}>
          <li><span style={codeStyle}>ziwei-theme</span> —— 浅色 / 深色主题偏好</li>
          <li><span style={codeStyle}>ziwei_history</span> —— 最近的排盘历史（最多保留 10 条）</li>
          <li><span style={codeStyle}>ziwei-qigua-history-v1</span> —— 易经起卦历史</li>
          <li><span style={codeStyle}>ziwei_mianxiang_history</span> —— 面相测算记录</li>
          <li><span style={codeStyle}>tianji-chat:*</span> —— 「问天纪」对话记忆</li>
          <li><span style={codeStyle}>announcement_seen_*</span> —— 站内公告已读状态</li>
        </ul>
        <p>你可在浏览器设置中随时清除这些数据，清除后仅会丢失历史记录与偏好，不影响排盘功能本身。</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>7. 未成年人</h2>
        <p>本站命理内容面向 18 岁以上成年用户。未成年人请在监护人同意下使用，并不得将解读用于重大人生决策。</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>8. 政策变更</h2>
        <p>本政策可能随功能调整而不定期更新，更新后将在本页标注最新日期。若涉及数据处理方式的重大变化，我们会以站内公告方式提示。继续使用即表示同意更新后的版本。</p>

        <p style={{ marginTop: 48, fontSize: 14, color: 'var(--tx-3)' }}>
          <a href="/terms" style={{ color: 'var(--ac-text)' }}>服务条款</a> · <a href="/" style={{ color: 'var(--ac-text)' }}>返回首页</a>
        </p>
        <SiteFooter />
      </main>
    </>
  );
}
