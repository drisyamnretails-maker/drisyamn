'use client'
import { useRouter } from 'next/navigation'

const ORANGE = "#E86A33";
const DARK = "#1F3A4A";
const PAGE_BG = "#EDE6D3";
const CARD_BG = "#FFFEFB";

const prettyBox: React.CSSProperties = {
  background: CARD_BG,
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 0 0 8px #FFFFFF, 0 0 0 9px rgba(0,0,0,0.10), 0 16px 40px rgba(62,42,20,0.14)",
};

export default function TermsPage(){
  const router = useRouter()
  return (
    <>
    <style>{`
     .prose h2{font-size:15px; font-weight:800; margin:28px 0 10px; color:${DARK}}
     .prose h2 span{color:${ORANGE}; margin-right:8px}
     .prose p,.prose li{font-size:13.5px; line-height:1.7; color:#6B5A4A}
     .prose ul{padding-left:18px; margin:10px 0}
     .prose li{margin-bottom:7px}
     .prose li::marker{color:${ORANGE}}
     .sticky-toc{position:sticky; top:90px}
     .toc-item{padding:8px 12px; border-radius:999px; font-size:12px; font-weight:600; color:#6B5A4A; cursor:pointer; display:block; text-decoration:none; transition:0.2s}
     .toc-item:hover{background:#F6F1E6; color:${DARK}; transform:translateX(2px)}
      @media (max-width:900px){.grid{grid-template-columns:1fr!important}.hide-m{display:none}}
    `}</style>

    <div style={{minHeight:"100vh", background:PAGE_BG}} className="pb-10 px-4">

      <div style={{maxWidth:1200, margin:"0 auto"}}>
        <div className="flex items-center justify-between px-7 h-[64px] rounded-[22px] mt-6 sticky top-6 z-20" style={prettyBox}>
          <b onClick={()=>router.push("/homefeed")} style={{fontSize:22, cursor:"pointer", fontFamily:"serif", color:DARK}}>Drisyamn<span style={{color:ORANGE}}>.</span></b>
          <div style={{display:"flex", gap:8}}>
            <button onClick={()=>router.push("/privacy")} style={{background:"#F6F1E6", border:"1px solid rgba(0,0,0,0.06)", color:DARK, padding:"8px 16px", borderRadius:999, fontSize:12, fontWeight:700, cursor:"pointer"}}>Privacy</button>
            <button onClick={()=>router.push("/homefeed")} style={{background:DARK, color:"white", border:"3px solid white", boxShadow:"0 2px 8px rgba(0,0,0,0.15)", padding:"8px 18px", borderRadius:999, fontSize:12, fontWeight:700, cursor:"pointer"}}>Home</button>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1200, margin:"0 auto", padding:"20px 0px"}}>

        <div className="rounded-[22px] p-7 flex gap-4 items-start" style={{...prettyBox, background:`linear-gradient(135deg, ${CARD_BG}, #F6F1E6)`}}>
          <div style={{width:52, height:52, borderRadius:16, background:DARK, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, border:"3px solid white", boxShadow:"0 4px 12px rgba(0,0,0,0.15)", flexShrink:0}}>📜</div>
          <div style={{flex:1}}>
            <h1 style={{fontSize:26, fontWeight:800, margin:0, color:DARK, fontFamily:"serif"}}>Terms & Conditions</h1>
            <p style={{fontSize:12, color:"#8A7A6A", margin:"6px 0 0"}}>Last Updated: September 13, 2026 • Drisyamn Community Platform</p>
            <div style={{marginTop:14, background:"#F6F1E6", border:"1px solid rgba(0,0,0,0.06)", padding:"12px 14px", borderRadius:14, fontSize:12, color:DARK, lineHeight:1.5, fontWeight:500}}>
              Welcome to Drisyamn. By using our app, website, and services, you agree to these Terms. If you don't agree, please don't use the Service.
            </div>
          </div>
        </div>

        <div className="grid" style={{display:"grid", gridTemplateColumns:"240px 1fr", gap:24, alignItems:"start", marginTop:20}}>

          <div className="hide-m sticky-toc">
            <div className="rounded-[22px] p-3" style={prettyBox}>
              <div style={{fontSize:11, fontWeight:800, color:DARK, padding:"8px 12px", letterSpacing:0.8, opacity:0.6}}>CONTENTS</div>
              {[
                "About Drisyamn","Eligibility","User Accounts","Use of Service","User Content","Reviews & Ratings","Business Info","Location Features","Third-Party","Payments","IP Rights","Copyright","Prohibited Content","Safety","Availability","Suspension","Privacy","Disclaimers","Liability","Indemnification","Changes","Governing Law","Contact"
              ].map((t,i)=>(
                <a key={i} href={`#sec-${i+1}`} className="toc-item">{i+1}. {t}</a>
              ))}
            </div>
            <div className="rounded-[22px] p-4 mt-4" style={{...prettyBox, background:"#F6F1E6"}}>
              <div style={{fontSize:12, fontWeight:800, color:DARK}}>Need help?</div>
              <div style={{fontSize:11, color:"#8A7A6A", marginTop:4}}>Contact our legal team</div>
              <div style={{fontSize:11, color:ORANGE, marginTop:8, fontWeight:700}}>support@drisyamn.com</div>
            </div>
          </div>

          <div className="rounded-[22px] prose p-7 md:p-8" style={prettyBox}>

            <div id="sec-1"><h2><span>1.</span> About Drisyamn</h2><p>Drisyamn is a local community and discovery platform designed to help users discover information, places, services, businesses, activities, events, and community-related content around them. Features and services may vary depending on your location, device, account type, and the version of the application.</p></div>
            <div id="sec-2"><h2><span>2.</span> Eligibility</h2><p>You must be legally capable of entering into these Terms to use Drisyamn. If you are under the applicable age of majority, you may use Drisyamn only with the involvement and consent of your parent or legal guardian where required by applicable law.</p></div>
            <div id="sec-3"><h2><span>3.</span> User Accounts</h2><p>Certain features may require you to create an account. You are responsible for:</p><ul><li>Providing accurate and current information.</li><li>Maintaining the security of your account.</li><li>Keeping your login credentials confidential.</li><li>All activity performed through your account.</li></ul></div>
            <div id="sec-4"><h2><span>4.</span> Use of the Service</h2><p>You agree to use Drisyamn only for lawful purposes. You must not:</p><ul><li>Violate any applicable law or regulation.</li><li>Harass, threaten, abuse, or intimidate other users.</li><li>Impersonate another person, business, or organization.</li><li>Create fraudulent or misleading listings, profiles, reviews, or content.</li></ul></div>
            <div id="sec-5"><h2><span>5.</span> User-Generated Content</h2><p>Drisyamn may allow users to submit, post, upload, publish, review, comment on, or otherwise provide content. You remain responsible for the User Content you submit. You grant Drisyamn a non-exclusive, worldwide, royalty-free license to host, store, reproduce, display, distribute, adapt, and use your User Content as reasonably necessary.</p></div>
            <div id="sec-6"><h2><span>6.</span> Reviews, Ratings and Recommendations</h2><p>Reviews and ratings represent the opinions of their respective authors and do not necessarily represent the views of Drisyamn. You must not submit fake reviews, pay or incentivize others to create misleading reviews, or manipulate ratings.</p></div>
            <div id="sec-7"><h2><span>7.</span> Business and Local Information</h2><p>Drisyamn may display information about businesses, services, locations, events, products, or other local resources. We do not guarantee that such information is always complete, accurate, current, or error-free.</p></div>
            <div id="sec-8"><h2><span>8.</span> Location-Based Features</h2><p>Drisyamn may offer features based on your approximate or precise location where you have provided the necessary permission.</p></div>
            <div id="sec-9"><h2><span>9.</span> Third-Party Services and Links</h2><p>Drisyamn may contain links to, integrations with, or information from third-party websites, applications, businesses, payment providers, mapping services, or other services.</p></div>
            <div id="sec-10"><h2><span>10.</span> Payments and Transactions</h2><p>If Drisyamn introduces paid features, subscriptions, advertising, bookings, purchases, or other transactions, additional terms may apply.</p></div>
            <div id="sec-11"><h2><span>11.</span> Intellectual Property</h2><p>The Drisyamn name, logo, branding, software, interface, design, graphics, original content, functionality, and other materials provided by Drisyamn are owned by or licensed to Drisyamn.</p></div>
            <div id="sec-12"><h2><span>12.</span> Copyright Complaints</h2><p>If you believe content available through Drisyamn infringes your copyright or other intellectual-property rights, you may contact us with appropriate information.</p></div>
            <div id="sec-13"><h2><span>13.</span> Prohibited Content</h2><p>You must not submit or distribute content that is illegal, promotes violence, contains threats or harassment, is fraudulent, infringes IP rights, violates privacy, or contains malicious code.</p></div>
            <div id="sec-14"><h2><span>14.</span> Safety</h2><p>Drisyamn is a discovery and community platform. We do not guarantee the safety, quality, legality, accuracy, or reliability of users, businesses, locations, events, services, or content displayed.</p></div>
            <div id="sec-15"><h2><span>15.</span> Availability of the Service</h2><p>We may modify, update, suspend, restrict, or discontinue all or part of Drisyamn at any time.</p></div>
            <div id="sec-16"><h2><span>16.</span> Account Suspension and Termination</h2><p>We may suspend, restrict, or terminate your account or access to Drisyamn if you violate these Terms.</p></div>
            <div id="sec-17"><h2><span>17.</span> Privacy</h2><p>Your use of Drisyamn is also governed by our Privacy Policy.</p></div>
            <div id="sec-18"><h2><span>18.</span> Disclaimers</h2><p>To the maximum extent permitted by applicable law, Drisyamn is provided on an “as is” and “as available” basis.</p></div>
            <div id="sec-19"><h2><span>19.</span> Limitation of Liability</h2><p>To the maximum extent permitted by applicable law, Drisyamn will not be liable for indirect, incidental, special, consequential, or punitive losses arising from or related to your use of the Service.</p></div>
            <div id="sec-20"><h2><span>20.</span> Indemnification</h2><p>You agree to defend, indemnify, and hold harmless Drisyamn from claims arising from your violation of these Terms or your User Content.</p></div>
            <div id="sec-21"><h2><span>21.</span> Changes to These Terms</h2><p>We may update these Terms from time to time. When material changes are made, we may provide notice through the application or website.</p></div>
            <div id="sec-22"><h2><span>22.</span> Governing Law</h2><p>These Terms shall be governed by the laws applicable in India.</p></div>
            <div id="sec-23" style={{marginTop:28, padding:18, background:"#F6F1E6", borderRadius:16, border:"1px dashed rgba(0,0,0,0.15)"}}>
              <h2 style={{marginTop:0}}><span>23.</span> Contact Us</h2>
              <p style={{margin:0, color:"#6B5A4A"}}><b style={{color:DARK}}>Drisyamn</b><br/>Email: support@drisyamn.com<br/>Website: www.drisyamn.com<br/>Address: Siliguri, West Bengal, India</p>
            </div>

            <div style={{marginTop:24, textAlign:"center", padding:16, background:DARK, borderRadius:999, fontSize:12, fontWeight:700, color:"white", border:"3px solid white", boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}}>
              By using Drisyamn, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.
            </div>

          </div>
        </div>
      </div>
    </div>
    </>
  )
}