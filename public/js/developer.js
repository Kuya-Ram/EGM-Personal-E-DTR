
// =====================================================
// EGM DEVELOPER PAGE
// Profile Portfolio & Commission Services
// =====================================================


// =====================================================
// 1. DEVELOPER PAGE STYLESHEET
// =====================================================

const developerStyles = `


.developer-skills-container {
    display: flex;
    flex-direction: column;
    gap: 22px;
}

.developer-skill-group {
    padding: 15px;
    background: rgba(0, 255, 255, 0.025);
    border: 1px solid rgba(0, 255, 255, 0.12);
    border-radius: 10px;
}

.developer-skill-group h4 {
    color: #00ffff;
    font-size: 18px;
    letter-spacing: 1px;
    margin-bottom: 13px;
}

.developer-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
}

.developer-page {
    width: 100%;
    color: #ffffff;
    animation: developerFadeIn 0.4s ease;
}

@keyframes developerFadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.developer-header {
    margin-bottom: 25px;
}

.developer-header h1 {
    font-size: 35px;
    margin-bottom: 8px;
}

.developer-header p {
    color: #8baab8;
    font-size: 13px;
}

.developer-grid {
    display: grid;
    grid-template-columns: 1.15fr 1fr 0.85fr;
    gap: 20px;
    align-items: stretch;
}

.developer-card {
    background: #0b2029;
    border: 1px solid rgba(0, 255, 255, 0.22);
    border-radius: 14px;
    padding: 25px;
    min-width: 0;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.developer-card h3 {
    color: #00ffff;
    font-size: 14px;
    letter-spacing: 1.5px;
    margin-bottom: 20px;
}

/* PROFILE */

.developer-profile {
    display: flex;
    gap: 25px;
    align-items: flex-start;
    margin-bottom: 25px;
}

.developer-profile-image {
    width: 150px;
    height: 150px;
    flex-shrink: 0;
    border-radius: 12px;
    border: 2px solid #00ffff;
    background: #06151d;
    overflow: hidden;
}

.developer-profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.developer-profile-info {
    padding-top: 5px;
}

.developer-profile-info h2 {
    font-size: 24px;
    color: #00ffff;
    margin: 0 0 5px;
}

.developer-profile-info h4 {
    font-size: 14px;
    color: #ffffff;
    font-weight: 500;
    margin-bottom: 15px;
}

.developer-profession {
    font-size: 13px;
    color: #9bbac6;
    margin-bottom: 18px;
}

.developer-socials {
    display: flex;
    gap: 12px;
    align-items: center;
}

.developer-socials a {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(0, 255, 255, 0.35);
    border-radius: 9px;
    color: #00ffff;
    text-decoration: none;
    font-size: 12px;
    font-weight: bold;
    transition: 0.25s ease;
}

.developer-socials a:hover {
    background: #00ffff;
    color: #06151d;
    transform: translateY(-3px);
}

/* ABOUT */

.developer-divider {
    height: 1px;
    background: rgba(0, 255, 255, 0.15);
    margin: 25px 0;
}

.developer-section-title {
    color: #00ffff;
    font-size: 13px;
    letter-spacing: 1px;
    margin-bottom: 12px;
}

.developer-about {
    color: #a9c1ca;
    font-size: 13px;
    line-height: 1.8;
}

/* SKILLS */

.developer-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
}

.developer-skill {
    padding: 8px 12px;
    background: rgba(0, 255, 255, 0.07);
    border: 1px solid rgba(0, 255, 255, 0.2);
    border-radius: 7px;
    color: #b9e8ed;
    font-size: 11px;
}

/* COMMISSION */

.developer-commission-intro {
    color: #a9c1ca;
    font-size: 13px;
    line-height: 1.8;
    margin-bottom: 25px;
}

.developer-service {
    background: #071922;
    border: 1px solid rgba(0, 255, 255, 0.15);
    border-radius: 10px;
    padding: 18px;
    margin-bottom: 14px;
    transition: 0.25s ease;
}

.developer-service:hover {
    border-color: #00ffff;
    transform: translateY(-2px);
}

.developer-service h4 {
    color: #00ffff;
    font-size: 14px;
    margin-bottom: 8px;
}

.developer-service p {
    color: #91adb8;
    font-size: 12px;
    line-height: 1.7;
}

.developer-commission-note {
    margin-top: 25px;
    padding: 15px;
    border-left: 3px solid #00ffff;
    background: rgba(0, 255, 255, 0.05);
    color: #a9c1ca;
    font-size: 12px;
    line-height: 1.7;
}

.developer-info-intro {
    color: #a9c1ca;
    font-size: 13px;
    line-height: 1.8;
    margin-bottom: 25px;
}

/* RESPONSIVE */

@media (max-width: 900px) {
    .developer-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 550px) {
    .developer-profile {
        flex-direction: column;
    }

    .developer-profile-image {
        width: 125px;
        height: 125px;
    }

    .developer-card {
        padding: 18px;
    }

    .developer-header h1 {
        font-size: 23px;
    }
}

`;


// =====================================================
// 2. LOAD DEVELOPER STYLES
// =====================================================

function loadDeveloperStyles() {

    if (document.querySelector("#developer-page-styles")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "developer-page-styles";
    style.textContent = developerStyles;

    document.head.appendChild(style);
}


// =====================================================
// 3. RENDER DEVELOPER PAGE
// =====================================================

window.renderDeveloper = function(mainContent) {

    if (!mainContent) {
        console.error("Developer Page: mainContent not found.");
        return;
    }

    loadDeveloperStyles();

    mainContent.innerHTML = `

        <div class="developer-page">

            <section class="developer-header">
                <span class="dashboard-label">
                    EGM CREATIVE DEVELOPER
                </span>

                <h1>Developer Portfolio</h1>

                <p>
                    Profile, Technical Skills and Creative Services.
                </p>
            </section>


            <div class="developer-grid">

                <!-- ================================= -->
                <!-- COLUMN 1: PROFILE INFORMATION -->
                <!-- ================================= -->

                <section class="developer-card">

                    <h3>PROFILE INFORMATION</h3>

                    <div class="developer-profile">

                        <div class="developer-profile-image">
                            <img
                                src="/img/egm-profile.jpg"
                                alt="Edmar Miralpes Profile"
                                onerror="this.style.display='none'"
                            >
                        </div>

                        <div class="developer-profile-info">

                            <h2>EGM Developer</h2>

                            <h4>Edmar Miralpes</h4>

                            <p class="developer-profession">
                                Graphic Designer & Web Developer
                            </p>

                            <div class="developer-socials">

                                <a
                                    href="https://www.linkedin.com/in/egmfreelancedeveloper/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="LinkedIn"
                                >
                                    in
                                </a>

                                <a
                                    href="https://github.com/Kuya-Ram"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="GitHub"
                                >
                                    GH
                                </a>

                                <a
                                    href="https://mail.google.com/mail/?view=cm&fs=1&to=ed17miralpes1994@gmail.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Open Gmail"
                                >
                                    @
                                </a>

                            </div>

                        </div>

                    </div>


                    <div class="developer-divider"></div>


                    <!-- ABOUT ME -->

                    <h4 class="developer-section-title">
                        ABOUT ME
                    </h4>

                    <p class="developer-about">
                        I am a BS in Computer Science graduate with a passion for
                        technology, creativity, and continuous learning. My interests
                        include graphic design, web development, programming, and
                        technical troubleshooting.

                        I enjoy transforming ideas into functional, creative, and
                        meaningful digital experiences through technology and design.
                        I am always eager to improve my skills, explore new technologies,
                        and take on opportunities that allow me to grow professionally.
                    </p>


                    <div class="developer-divider"></div>

                    <!-- TECHNICAL SKILLS -->

                    <h4 class="developer-section-title">
                        TECHNICAL SKILLS
                    </h4>

                    <div class="developer-skills-container">

                        <!-- IT SUPPORT -->

                        <div class="developer-skill-group">
                            <h4>IT SUPPORT</h4>

                            <div class="developer-skills">
                                <span class="developer-skill">Computer Troubleshooting</span>
                                <span class="developer-skill">Software Troubleshooting</span>
                                <span class="developer-skill">LAN Installation</span>
                                <span class="developer-skill">Router Configuration</span>
                                <span class="developer-skill">Network Setup</span>
                                <span class="developer-skill">Printer Troubleshooting</span>
                                <span class="developer-skill">CCTV Installation Assistance</span>
                            </div>
                        </div>


                        <!-- PHOTO AND VIDEO EDITING TOOLS -->

                        <div class="developer-skill-group">
                            <h4>PHOTO AND VIDEO EDITING TOOLS</h4>

                            <div class="developer-skills">
                                <span class="developer-skill">Canva</span>
                                <span class="developer-skill">CapCut</span>
                                <span class="developer-skill">Photopea</span>
                                <span class="developer-skill">Adobe Photoshop</span>
                                <span class="developer-skill">Microsoft Publisher</span>
                            </div>
                        </div>


                        <!-- PROGRAMMING LANGUAGES -->

                        <div class="developer-skill-group">
                            <h4>PROGRAMMING LANGUAGES</h4>

                            <div class="developer-skills">
                                <span class="developer-skill">HTML</span>
                                <span class="developer-skill">CSS</span>
                                <span class="developer-skill">JavaScript</span>
                                <span class="developer-skill">Java</span>
                                <span class="developer-skill">Python</span>
                                <span class="developer-skill">PHP</span>
                                <span class="developer-skill">SQL</span>
                                <span class="developer-skill">MySQL</span>
                                <span class="developer-skill">TypeScript</span>
                            </div>
                        </div>


                        <!-- DEVELOPER TOOLS -->

                        <div class="developer-skill-group">
                            <h4>DEVELOPER TOOLS</h4>

                            <div class="developer-skills">
                                <span class="developer-skill">Visual Studio Code</span>
                                <span class="developer-skill">Git</span>
                                <span class="developer-skill">GitHub</span>
                                <span class="developer-skill">MySQL Workbench</span>
                                <span class="developer-skill">Node.js</span>
                                <span class="developer-skill">Express.js</span>
                                <span class="developer-skill">Bootstrap</span>
                                <span class="developer-skill">Tailwind CSS</span>
                            </div>
                        </div>

                    </div>


                </section>


                <!-- ================================= -->
                <!-- COLUMN 2: COMMISSION SERVICES -->
                <!-- ================================= -->

                <section class="developer-card">

                    <h3>COMMISSION SERVICES</h3>

                    <p class="developer-commission-intro">
                        Welcome to my creative services section.
                        Explore the services I offer for personal,
                        academic, and business projects.
                    </p>


                    <div class="developer-service">

                        <h4>01. Graphic Design</h4>

                        <p>
                            Creative graphic design services including logo and brand identity,
                            posters, presentation designs, web layouts, advertising brochures,
                            invitation cards, and celebration or event materials—designed to
                            make every idea visually engaging and memorable.
                        </p>

                    </div>


                    <div class="developer-service">

                        <h4>02. Web Development / Programming</h4>

                        <p>
                            I offer web development and programming services focused on creating functional,
                            responsive, and user-friendly websites, web applications, and customized
                            software solutions. My work includes website development, front-end and back-end
                            programming, database integration, system development, and basic application troubleshooting.
                        </p>

                    </div>


                    <div class="developer-service">

                        <h4>03. Creative Writing & Composition </h4>

                        <p>
                            I offer writing and composition services for academic, professional, and creative projects.
                            My services include essay writing, document research, research summaries, poetry composition,
                            song lyrics writing, music composition, and other customized written or creative content.
                            Each project is developed according to the client's instructions, preferred style, and intended purpose.
                        </p>

                    </div>


                    <div class="developer-service">

                        <h4>04. Video Editing</h4>

                        <p>
                            I offer video editing and production services focused on creating engaging, polished, and visually appealing video content.
                            My services include video trimming and cutting, transitions, effects, color correction, audio synchronization,
                            subtitles and captions, promotional videos, social media content, video presentations, and customized video projects.
                        </p>

                    </div>

                </section>


                <!-- ================================= -->
                <!-- COLUMN 3: COMMISSION INFORMATION -->
                <!-- ================================= -->

                <section class="developer-card">

                    <h3>COMMISSION INFORMATION</h3>
                    <p class="developer-info-intro">
                        Explore the guidelines and requirements for requesting my creative services.
                        Learn more about commission rates, project proposals, consultation arrangements,
                        accepted payment methods, and how to get in touch with me for inquiries
                        and project discussions.
                    </p>

                    <div class="developer-service">
                        <h4>01. Commission Rates</h4>
                        <p>
                            <strong>Rates are negotiable</strong>
                        </p>
                        <p>
                            Pricing will be discussed and finalized through email or chat,
                            depending on the project's scope, complexity, and requirements.
                        </p>
                    </div>

                    <div class="developer-service">
                        <h4>02. Project Requirements</h4>
                        <p>
                            Before starting a commission, the client must provide a project proposal
                            document containing the project details, objectives, and expected output.
                        <p>
                            A video call can also be arranged to discuss the project, clarify requirements,
                            and ensure that both parties have a clear understanding of the work.
                        </p>
                    </div>

                    <div class="developer-service">
                        <h4>03. Payment Method</h4>
                        <p>
                            <strong>Accepted Payment Method: GCash</strong>
                        </p>
                        <p>
                            Payment details and arrangements will be provided
                            once the commission has been discussed and confirmed.
                        </p>
                    </div>

                    <div class="developer-service">
                        <h4>04. Contact Information</h4>
                        <p>
                            For commission inquiries and project discussions, you may contact me through the email
                            link below the Developer Portfolio section or click my name in the website footer.
                        </p>
                    </div>

                </section>


            </div>

        </div>

    `;

};
