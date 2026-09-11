import SiteFooter from '@/components/SiteFooter';
import { SITE_NAME, SITE_FULL_NAME } from '@/lib/site';

export const metadata = {
  title: `服务条款 · ${SITE_NAME}`,
  description: `${SITE_FULL_NAME} 服务条款：免费、无需注册的紫微斗数排盘与学习平台使用说明。`,
};

export default function TermsPage() {
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
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>服务条款</h1>
        <p style={{ fontSize: 14, color: 'var(--tx-3)', marginBottom: 24 }}>最后更新：2026 年 9 月</p>

        <p style={{ background: 'var(--ac-bg)', border: '1px solid var(--ac-bdr)', padding: 16, borderRadius: 8, fontSize: 15 }}>
          <strong>一句话说明</strong>：{SITE_NAME}是一个免费、无需注册、非商业性的紫微斗数学习与排盘工具。
          排盘在本地完成，AI 解读为辅助功能。全部命理内容仅供文化与自我认识参考，
          <strong>不构成医疗、投资、法律、心理咨询或任何重大人生决策建议</strong>。
        </p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. 服务概述</h2>
        <p>
          {SITE_NAME}（以下简称「本站」）依据倪海厦《天纪》紫微斗数体系与三合派传统方法，
          提供命盘排盘、格局识别、古籍检索、天纪 / 地纪 / 人纪学习内容，以及基于大语言模型的辅助解读。
          本站<strong>完全免费</strong>，<strong>无需注册或登录</strong>，不提供会员、订阅、付费解盘等商业服务。
        </p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. 使用规范</h2>
        <p>使用本站即表示你同意：</p>
        <ul style={{ paddingLeft: 24 }}>
          <li>仅出于合法、个人学习与参考目的使用本站。</li>
          <li>不进行拒绝服务攻击、恶意扫描，或以自动化脚本高频、批量调用本站 AI 接口，影响他人正常使用。</li>
          <li>不冒用本站名义发布信息，或将本站内容包装为付费算命、投资建议等对外销售。</li>
          <li>提交的出生信息由你自行负责；因信息填写错误导致的解读偏差，本站不承担责任。</li>
        </ul>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. 内容来源与知识产权</h2>
        <ul style={{ paddingLeft: 24 }}>
          <li><strong>排盘算法</strong>：命盘推演基于社区开源的紫微斗数排盘库实现，本站在其之上完成了倪海厦体系的口径校准与呈现设计。</li>
          <li><strong>古籍与整理内容</strong>：原文取自《紫微斗数全集》《紫微斗数全书》《骨髓赋》等公开出版物与传统典籍，页面标注了具体出处；数据整理的上游来源在项目说明文档中保留署名。</li>
          <li><strong>倪海厦先生相关内容</strong>：其讲义、语录与课程内容的著作权归原作者及相关权利人所有，本站仅作学习研究范围内的引用与整理，不作商业使用。</li>
          <li><strong>本站原创部分</strong>：页面设计、解读文案与知识组织方式由本站整理。欢迎学习交流与注明来源的引用；如需整站转载或商业使用，请先与我们联系。</li>
          <li><strong>侵权处理</strong>：若你认为本站内容侵犯了你的合法权益，请通过项目仓库反馈并提供权属证明，我们会在核实后及时删除或调整。</li>
        </ul>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. 免责声明</h2>
        <p>
          本站命理内容基于传统紫微斗数与倪海厦体系的知识整理，<strong>不保证 100% 准确</strong>。
          命运受天、地、人三才共同影响，本站输出仅作为认识自我的参考，请理性看待，不应过度依赖任何单一命理判断。
        </p>
        <p>
          因使用本站内容产生的任何后果（包括但不限于决策失误、心理影响、人际关系变化等），本站不承担法律责任。
        </p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>5. 服务变更与终止</h2>
        <p>本站为个人性质的长期研究项目，保留随时调整、暂停或终止部分或全部功能的权利。重大变更会以站内公告方式提示。</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>6. 法律适用与争议解决</h2>
        <p>本条款适用中华人民共和国法律。若发生争议，双方应友好协商解决；协商不成的，提交有管辖权的人民法院诉讼解决。</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>7. 反馈与联系</h2>
        <p>
          本站为个人非商业项目，<strong>不设付费客服与商务渠道</strong>。如对内容有疑问、发现错漏，
          或涉及版权问题需要处理，欢迎通过项目仓库提交反馈，我们会尽快响应。
        </p>

        <p style={{ marginTop: 48, fontSize: 14, color: 'var(--tx-3)' }}>
          <a href="/privacy" style={{ color: 'var(--ac-text)' }}>隐私政策</a> · <a href="/" style={{ color: 'var(--ac-text)' }}>返回首页</a>
        </p>
        <SiteFooter />
      </main>
    </>
  );
}
