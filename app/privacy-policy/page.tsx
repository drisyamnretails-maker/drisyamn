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

export default function PrivacyPage(){
  const router = useRouter()
  return (
    <>
    <style>{`
     .prose h2{font-size:15px; font-weight:800; margin:28px 0 10px; color:${DARK}}
     .prose h2 span{color:${ORANGE}; margin-right:8px}
     .prose h3{font-size:13px; font-weight:700; margin:18px 0 8px; color:${DARK}}
     .prose p,.prose li{font-size:13.5px; line-height:1.7; color:#6B5A4A}
     .prose ul{padding-left:18px; margin:10px 0}
     .prose li{margin-bottom:7px}
     .prose li::marker{color:${ORANGE}}
     .sticky-toc{position:sticky; top:90px}
     .toc-item{padding:8px 12px; border-radius:999px; font-size:12px; font-weight:600; color:#6B5A4A; cursor:pointer; display:block; text-decoration:none; transition:0.2s; border:1px solid transparent}
     .toc-item:hover{background:#F6F1E6; color:${DARK}; transform:translateX(2px)}
      @media (max-width:900px){.grid{grid-template-columns:1fr!important}.hide-m{display:none} }
    `}</style>

    <div style={{minHeight:"100vh", background:PAGE_BG, color:DARK}} className="pb-10 px-4">

      <div style={{maxWidth:1200, margin:"0 auto", width:"100%"}}>
        <div className="flex items-center justify-between px-7 h-[64px] rounded-[22px] mt-6 sticky top-6 z-20" style={prettyBox}>
          <b onClick={()=>router.push("/homefeed")} style={{fontSize:22, cursor:"pointer", fontFamily:"serif"}}>Drisyamn<span style={{color:ORANGE}}>.</span></b>
          <div style={{display:"flex", gap:8}}>
            <button onClick={()=>router.push("/terms")} style={{background:"#F6F1E6", border:"1px solid rgba(0,0,0,0.06)", color:DARK, padding:"8px 16px", borderRadius:999, fontSize:12, fontWeight:700, cursor:"pointer"}}>Terms</button>
            <button onClick={()=>router.push("/homefeed")} style={{background:DARK, color:"white", border:"3px solid white", boxShadow:"0 2px 8px rgba(0,0,0,0.15)", padding:"8px 18px", borderRadius:999, fontSize:12, fontWeight:700, cursor:"pointer"}}>Home</button>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1200, margin:"0 auto", padding:"20px 0px"}}>

        <div className="rounded-[22px] p-7 flex gap-4 items-start" style={{...prettyBox, background:`linear-gradient(135deg, ${CARD_BG}, #F6F1E6)`}}>
          <div style={{width:52, height:52, borderRadius:16, background:DARK, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, border:"3px solid white", boxShadow:"0 4px 12px rgba(0,0,0,0.15)", flexShrink:0}}>🔐</div>
          <div style={{flex:1}}>
            <h1 style={{fontSize:26, fontWeight:800, margin:0, color:DARK, fontFamily:"serif"}}>Privacy Policy</h1>
            <p style={{fontSize:12, color:"#8A7A6A", margin:"6px 0 0"}}>Effective Date: September 12, 2026 • Last Updated: September 12, 2026</p>
            <div style={{marginTop:14, background:"#F6F1E6", border:"1px solid rgba(0,0,0,0.06)", padding:"12px 14px", borderRadius:14, fontSize:12, color:DARK, lineHeight:1.5, fontWeight:500}}>
              Drisyamn respects your privacy and is committed to protecting your personal information. By using our Services, you acknowledge you have read this Policy.
            </div>
          </div>
        </div>

        <div className="grid" style={{display:"grid", gridTemplateColumns:"240px 1fr", gap:24, alignItems:"start", marginTop:20}}>

          <div className="hide-m sticky-toc">
            <div className="rounded-[22px] p-3" style={prettyBox}>
              <div style={{fontSize:11, fontWeight:800, color:DARK, padding:"8px 12px", letterSpacing:0.8, opacity:0.6}}>CONTENTS</div>
              {[
                "Information We Collect","How We Use","How We Share","Third-Party Services","Permissions","Location","Camera & Files","Payments","Security","Data Retention","Account Deletion","Children Privacy","Your Rights","Consent","India Data Law","Changes","Contact Us","Important Notice"
              ].map((t,i)=>(
                <a key={i} href={`#p-${i+1}`} className="toc-item">{i+1}. {t}</a>
              ))}
            </div>
            <div className="rounded-[22px] p-4 mt-4" style={{...prettyBox, background:"#F6F1E6"}}>
              <div style={{fontSize:12, fontWeight:800, color:DARK}}>Privacy Support</div>
              <div style={{fontSize:11, color:"#8A7A6A", marginTop:4}}>For deletion & privacy requests</div>
              <div style={{fontSize:11, color:ORANGE, marginTop:8, fontWeight:700}}>privacy@drisyamn.com</div>
            </div>
          </div>

          <div className="rounded-[22px] prose p-7 md:p-8" style={prettyBox}>

            <div id="p-1"><h2><span>1.</span> Information We May Collect</h2>
              <h3>A. Information You Provide</h3><p>This may include:</p>
              <ul><li>Name</li><li>Email address</li><li>Phone number</li><li>Account/login information</li><li>Business or shop information</li><li>Address or delivery information</li><li>Information you provide when contacting support</li><li>Other information that you voluntarily submit</li></ul>
              <p>We only request information that is reasonably necessary for the relevant functionality.</p>
              <h3>B. Device and Technical Information</h3><ul><li>Device type and model, OS and version, App version, IP address, Device identifiers, Crash and diagnostic info, Network info, General usage info</li></ul>
              <h3>C. Information You Create or Upload</h3><p>If the Services allow you to create, upload, store, or manage information such as products, images, documents, business records, or other content, that information may be processed to provide the requested functionality.</p>
            </div>

            <div id="p-2"><h2><span>2.</span> How We Use Information</h2><p>We may use information for:</p><ul><li>Providing and operating the Services</li><li>Creating and managing user accounts</li><li>Authenticating users</li><li>Processing transactions or requested services</li><li>Providing customer support</li><li>Maintaining and improving the Services</li><li>Detecting and preventing fraud, abuse, and unauthorized activity</li><li>Diagnosing technical problems</li><li>Protecting the security of our users and Services</li><li>Complying with applicable legal obligations</li><li>Communicating important service-related information</li></ul></div>

            <div id="p-3"><h2><span>3.</span> How We Share Information</h2><p>Drisyamn does not sell your personal information as a business practice. We may share information when reasonably necessary with service providers, hosting, cloud-storage, authentication, analytics, security providers, payment providers, professional advisers, government authorities when required by law, and other parties when necessary to protect rights, safety, security, or property.</p></div>

            <div id="p-4"><h2><span>4.</span> Third-Party Services</h2><p>The Services may use third-party technologies, libraries, SDKs, APIs, hosting providers, analytics, authentication, payment services, or other infrastructure. Such third parties may process information according to their own privacy policies.</p><p>Examples include services used for authentication, cloud storage, hosting, analytics, crash reporting, payments, notifications, security. The exact third-party services used may vary between Drisyamn applications.</p></div>

            <div id="p-5"><h2><span>5.</span> Permissions</h2><p>Depending on functionality, the app may request permissions such as internet/network access, camera access, photo or file access, notifications, location access, and other device permissions required for specific features. Permissions will only be requested when necessary. You can manage many permissions through your device settings.</p></div>

            <div id="p-6"><h2><span>6.</span> Location Information</h2><p>Some applications may use location information if a feature specifically requires it. Where location access is requested, the application will use the information for the relevant functionality and will not request continuous location access unless necessary for the intended feature.</p></div>

            <div id="p-7"><h2><span>7.</span> Camera, Photos, and Files</h2><p>If an application provides features involving photographs, scanning, uploading, document management, or similar functionality, it may request access to camera, photos, media, or files. Such access is used to provide the feature requested by you. We do not access personal files unrelated to the functionality for which permission has been granted.</p></div>

            <div id="p-8"><h2><span>8.</span> Payments</h2><p>If an application supports payments, payment information may be processed by the applicable payment provider. Where a third-party payment processor is used, Drisyamn may not directly receive or store complete payment-card information.</p></div>

            <div id="p-9"><h2><span>9.</span> Data Security</h2><p>We take reasonable technical and organizational measures designed to protect personal information against unauthorized access, alteration, disclosure, misuse, or destruction. However, no method of electronic transmission or storage can be guaranteed to be completely secure. You are responsible for maintaining confidentiality of your account credentials.</p></div>

            <div id="p-10"><h2><span>10.</span> Data Retention</h2><p>We retain information only for as long as reasonably necessary for the purposes described in this Policy, including providing Services, maintaining records, resolving disputes, preventing abuse or fraud, and complying with legal obligations. When no longer required, we may delete, anonymize, or securely dispose of it.</p></div>

            <div id="p-11"><h2><span>11.</span> Account and Data Deletion</h2><p>If an application allows users to create an account, users may request deletion of their account and associated personal information through the deletion mechanism provided by the app or through the designated account-deletion process.</p></div>

            <div id="p-12"><h2><span>12.</span> Children's Privacy</h2><p>The Services are not intended to knowingly collect personal information from children in circumstances where such collection is prohibited by applicable law.</p></div>

            <div id="p-13"><h2><span>13.</span> Your Privacy Choices and Rights</h2><p>Depending on applicable law, you may have rights regarding your personal information, including rights to request access, correction, deletion, withdraw consent, request information about processing, and submit a privacy-related complaint.</p></div>

            <div id="p-14"><h2><span>14.</span> Consent</h2><p>Where consent is required, Drisyamn will seek consent in an appropriate manner. Where processing is based on consent, you may withdraw that consent where permitted by law.</p></div>

            <div id="p-15"><h2><span>15.</span> India's Data Protection Requirements</h2><p>Where applicable, Drisyamn seeks to handle personal data consistently with applicable Indian data-protection requirements, including the Digital Personal Data Protection Act, 2023.</p></div>

            <div id="p-16"><h2><span>16.</span> Changes to This Privacy Policy</h2><p>We may update this Privacy Policy from time to time to reflect changes to our Services, technology, legal requirements, or privacy practices.</p></div>

            <div id="p-17" style={{marginTop:28, padding:18, background:"#F6F1E6", borderRadius:16, border:"1px dashed rgba(0,0,0,0.15)"}}>
              <h2 style={{marginTop:0}}><span>17.</span> Contact Us</h2>
              <p style={{margin:0, color:"#6B5A4A"}}><b style={{color:DARK}}>Developer/Company: Drisyamn</b><br/>Privacy Contact: privacy@drisyamn.com<br/>Support: support@drisyamn.com<br/>Website: www.drisyamn.com<br/>Address: Siliguri, West Bengal, India</p>
            </div>

            <div id="p-18"><h2><span>18.</span> Important Notice</h2><p>This Privacy Policy is intended to describe the privacy practices applicable to Drisyamn Services. Because different Drisyamn applications may provide different functionality and may use different third-party services, additional application-specific privacy disclosures may apply.</p></div>

            <div style={{marginTop:28, display:"flex", gap:12}}>
              <button onClick={()=>router.push("/terms")} style={{flex:1, background:"#F6F1E6", border:"1px solid rgba(0,0,0,0.08)", color:DARK, padding:"14px", borderRadius:999, fontSize:12, fontWeight:800, cursor:"pointer"}}>View Terms & Conditions</button>
              <button onClick={()=>router.push("/homefeed")} style={{flex:1, background:DARK, color:"white", border:"3px solid white", boxShadow:"0 4px 12px rgba(0,0,0,0.15)", padding:"14px", borderRadius:999, fontSize:12, fontWeight:800, cursor:"pointer"}}>Back to Home</button>
            </div>

            <div style={{marginTop:16, textAlign:"center", padding:14, background:DARK, borderRadius:999, fontSize:11, fontWeight:700, color:"white", border:"3px solid white", boxShadow:"0 4px 12px rgba(0,0,0,0.1)"}}>
              Last Updated: September 12, 2026 • Your privacy is safe with Drisyamn • Matigara
            </div>

          </div>
        </div>
      </div>
    </div>
    </>
  )
}