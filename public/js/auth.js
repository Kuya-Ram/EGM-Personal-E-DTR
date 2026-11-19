
/* =========================================================
   PERSONAL DTR SYSTEM
   AUTHENTICATION PAGE
   SIGN IN / SIGN UP
   ========================================================= */

export function renderAuthPage(container, onLoginSuccess) {
    container.innerHTML = `
        <section class="auth-page">

            <div class="auth-wrapper">

                <!-- LEFT SIDE: BRANDING -->
                <div class="auth-brand">
                    <div class="auth-logo">PERSONAL<span>DTR</span></div>

                    <div class="auth-brand-content">
                        <div class="auth-symbol">◈</div>
                        <h1>Your Time.<br>Your Records.</h1>
                        <p>
                            Manage your attendance, overtime,
                            and salary records in one personal workspace.
                        </p>
                    </div>

                    <div class="auth-version">
                        PERSONAL RECORDKEEPING SYSTEM · V1.0
                    </div>
                </div>

                <!-- RIGHT SIDE: AUTHENTICATION -->
                <div class="auth-panel">

                    <div class="auth-heading">
                        <span class="auth-label">ACCOUNT ACCESS</span>
                        <h2 id="auth-title">Welcome Back</h2>
                        <p id="auth-subtitle">
                            Sign in to access your personal DTR.
                        </p>
                    </div>

                    <!-- TAB SWITCH -->
                    <div class="auth-tabs">
                        <button type="button"
                            class="auth-tab active"
                            id="signin-tab">
                            Sign In
                        </button>

                        <button type="button"
                            class="auth-tab"
                            id="signup-tab">
                            Sign Up
                        </button>
                    </div>

                    <div id="auth-message" class="auth-message"
                        role="status" aria-live="polite"></div>

                    <!-- SIGN IN FORM -->
                    <form id="signin-form" class="auth-form">

                        <div class="auth-field">
                            <label for="login-username">USERNAME</label>
                            <input
                                type="text"
                                id="login-username"
                                name="username"
                                placeholder="Enter your username"
                                autocomplete="username"
                                required
                            >
                        </div>

                        <div class="auth-field">
                            <label for="login-password">PASSWORD</label>

                            <div class="password-wrap">
                                <input
                                    type="password"
                                    id="login-password"
                                    name="password"
                                    placeholder="Enter your password"
                                    autocomplete="current-password"
                                    required
                                >

                                <button type="button"
                                    class="password-toggle"
                                    data-target="login-password">
                                    SHOW
                                </button>
                            </div>
                        </div>

                        <div class="auth-options">
                            <label class="remember-option">
                                <input type="checkbox" name="remember">
                                <span>Remember Me</span>
                            </label>
                        </div>

                        <button type="submit" class="auth-submit">
                            SIGN IN <span>→</span>
                        </button>

                        <p class="auth-switch-text">
                            Don't have an account?
                            <button type="button" data-switch="signup">
                                Create Account
                            </button>
                        </p>

                    </form>

                    <!-- SIGN UP FORM -->
                    <form id="signup-form" class="auth-form" hidden>

                        <div class="auth-field">
                            <label for="register-name">FULL NAME</label>
                            <input
                                type="text"
                                id="register-name"
                                name="fullName"
                                placeholder="Enter your full name"
                                autocomplete="name"
                                required
                            >
                        </div>

                        <div class="auth-field">
                            <label for="register-username">USERNAME</label>
                            <input
                                type="text"
                                id="register-username"
                                name="username"
                                placeholder="Create a username"
                                autocomplete="username"
                                minlength="4"
                                required
                            >
                        </div>

                        <div class="auth-field">
                            <label for="register-password">PASSWORD</label>

                            <div class="password-wrap">
                                <input
                                    type="password"
                                    id="register-password"
                                    name="password"
                                    placeholder="Create a password"
                                    autocomplete="new-password"
                                    minlength="8"
                                    required
                                >

                                <button type="button"
                                    class="password-toggle"
                                    data-target="register-password">
                                    SHOW
                                </button>
                            </div>
                        </div>

                        <div class="auth-field">
                            <label for="confirm-password">
                                CONFIRM PASSWORD
                            </label>

                            <div class="password-wrap">
                                <input
                                    type="password"
                                    id="confirm-password"
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    autocomplete="new-password"
                                    minlength="8"
                                    required
                                >

                                <button type="button"
                                    class="password-toggle"
                                    data-target="confirm-password">
                                    SHOW
                                </button>
                            </div>
                        </div>

                        <div class="auth-field">
                            <label for="register-salary">
                                BASIC SALARY FEE PER DAY
                            </label>

                            <select id="register-salary"
                                name="basicSalary" required>
                                <option value="550">
                                    ₱550 / Day - Extra Employee
                                </option>
                            </select>

                            <small>
                                Current verified salary category for Version 1.0.
                            </small>
                        </div>

                        <button type="submit" class="auth-submit">
                            CREATE ACCOUNT <span>→</span>
                        </button>

                        <p class="auth-switch-text">
                            Already have an account?
                            <button type="button" data-switch="signin">
                                Sign In
                            </button>
                        </p>

                    </form>

                    <div class="auth-footer">
                        Secure Personal Access · Version 1.0
                    </div>

                </div>
            </div>
        </section>
    `;

    /* =====================================================
       AUTHENTICATION PAGE STYLES
       ===================================================== */

    if (!document.getElementById("auth-page-styles")) {
        const style = document.createElement("style");
        style.id = "auth-page-styles";

        style.textContent = `
            .auth-page {
                min-height: 85vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 40px 20px;
                color: #EAFBFF;
            }

            .auth-wrapper {
                width: 100%;
                max-width: 1050px;
                min-height: 620px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                overflow: hidden;
                border: 1px solid rgba(125,249,255,.18);
                border-radius: 22px;
                background: rgba(11,31,46,.88);
                box-shadow: 0 25px 80px rgba(0,0,0,.35);
            }

            .auth-brand {
                padding: 42px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                background:
                    radial-gradient(circle at 20% 20%,
                    rgba(0,140,255,.25), transparent 55%),
                    #0B1F2E;
                border-right: 1px solid rgba(125,249,255,.12);
            }

            .auth-logo {
                font-size: 20px;
                font-weight: 900;
                letter-spacing: 2px;
            }

            .auth-logo span {
                color: #00FFFF;
            }

            .auth-brand-content {
                max-width: 370px;
            }

            .auth-symbol {
                font-size: 55px;
                color: #00FFFF;
                text-shadow: 0 0 25px rgba(0,255,255,.5);
            }

            .auth-brand h1 {
                font-size: clamp(35px, 5vw, 52px);
                line-height: 1.08;
                margin: 18px 0;
            }

            .auth-brand-content p {
                color: #91AAB8;
                line-height: 1.8;
            }

            .auth-version,
            .auth-footer {
                font-size: 10px;
                letter-spacing: 1.5px;
                color: #7895A5;
            }

            .auth-panel {
                padding: 42px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            .auth-label {
                color: #00FFFF;
                font-size: 10px;
                font-weight: 800;
                letter-spacing: 2px;
            }

            .auth-heading h2 {
                font-size: 30px;
                margin: 10px 0;
            }

            .auth-heading p {
                color: #91AAB8;
                font-size: 13px;
            }

            .auth-tabs {
                display: flex;
                gap: 8px;
                padding: 5px;
                margin: 25px 0;
                border-radius: 10px;
                background: #06131F;
            }

            .auth-tab {
                flex: 1;
                border: 0;
                border-radius: 7px;
                padding: 12px;
                cursor: pointer;
                color: #91AAB8;
                background: transparent;
                font-weight: 700;
            }

            .auth-tab.active {
                color: #06131F;
                background: #00FFFF;
                box-shadow: 0 0 18px rgba(0,255,255,.2);
            }

            .auth-form {
                display: flex;
                flex-direction: column;
                gap: 17px;
            }

            .auth-form[hidden] {
                display: none;
            }

            .auth-field {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .auth-field label {
                color: #7DF9FF;
                font-size: 10px;
                font-weight: 800;
                letter-spacing: 1.3px;
            }

            .auth-field input,
            .auth-field select {
                width: 100%;
                min-height: 46px;
                padding: 12px 14px;
                border: 1px solid rgba(125,249,255,.2);
                border-radius: 8px;
                outline: none;
                color: #EAFBFF;
                background: #06131F;
                font: inherit;
                font-size: 13px;
            }

            .auth-field input:focus,
            .auth-field select:focus {
                border-color: #00FFFF;
                box-shadow: 0 0 0 3px rgba(0,255,255,.08);
            }

            .auth-field input::placeholder {
                color: #587181;
            }

            .auth-field small {
                color: #7895A5;
                font-size: 10px;
            }

            .password-wrap {
                position: relative;
            }

            .password-wrap input {
                padding-right: 65px;
            }

            .password-toggle {
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                border: 0;
                background: transparent;
                color: #7DF9FF;
                font-size: 10px;
                font-weight: 800;
                cursor: pointer;
            }

            .auth-options {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: #91AAB8;
            }

            .remember-option {
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
            }

            .auth-submit {
                width: 100%;
                padding: 15px;
                border: 0;
                border-radius: 8px;
                background: linear-gradient(100deg,#008CFF,#00FFFF);
                color: #06131F;
                font-weight: 900;
                letter-spacing: 1px;
                cursor: pointer;
                transition: .2s;
            }

            .auth-submit:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0,255,255,.2);
            }

            .auth-submit span {
                float: right;
            }

            .auth-switch-text {
                color: #91AAB8;
                font-size: 12px;
                text-align: center;
            }

            .auth-switch-text button {
                border: 0;
                background: transparent;
                color: #00FFFF;
                font-weight: 800;
                cursor: pointer;
            }

            .auth-message {
                display: none;
                padding: 11px;
                margin-bottom: 15px;
                border-radius: 7px;
                font-size: 12px;
            }

            .auth-message.show {
                display: block;
            }

            .auth-message.error {
                color: #FF9C9C;
                background: rgba(255,70,70,.1);
                border: 1px solid rgba(255,70,70,.25);
            }

            .auth-message.info {
                color: #7DF9FF;
                background: rgba(0,255,255,.08);
                border: 1px solid rgba(0,255,255,.2);
            }

            .auth-footer {
                margin-top: 25px;
                text-align: center;
            }

            @media(max-width: 760px) {
                .auth-wrapper {
                    max-width: 480px;
                    grid-template-columns: 1fr;
                }

                .auth-brand {
                    min-height: 190px;
                    padding: 25px;
                }

                .auth-brand-content {
                    margin-top: 25px;
                }

                .auth-brand h1 {
                    font-size: 30px;
                }

                .auth-symbol {
                    display: none;
                }

                .auth-version {
                    margin-top: 20px;
                }

                .auth-panel {
                    padding: 28px 22px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /* =====================================================
       AUTHENTICATION PAGE INTERACTIONS
       ===================================================== */

    const signinForm = container.querySelector("#signin-form");
    const signupForm = container.querySelector("#signup-form");
    const signinTab = container.querySelector("#signin-tab");
    const signupTab = container.querySelector("#signup-tab");
    const title = container.querySelector("#auth-title");
    const subtitle = container.querySelector("#auth-subtitle");
    const message = container.querySelector("#auth-message");

    function showMessage(text, type = "info") {
        message.textContent = text;
        message.className = `auth-message show ${type}`;
    }

    function switchAuth(mode) {
        const isSignin = mode === "signin";

        signinForm.hidden = !isSignin;
        signupForm.hidden = isSignin;

        signinTab.classList.toggle("active", isSignin);
        signupTab.classList.toggle("active", !isSignin);

        title.textContent = isSignin
            ? "Welcome Back"
            : "Create Your Account";

        subtitle.textContent = isSignin
            ? "Sign in to access your personal DTR."
            : "Register to start managing your records.";

        message.className = "auth-message";
    }

    signinTab.addEventListener("click", () => switchAuth("signin"));
    signupTab.addEventListener("click", () => switchAuth("signup"));

    container.querySelectorAll("[data-switch]").forEach(button => {
        button.addEventListener("click", () => {
            switchAuth(button.dataset.switch);
        });
    });

    container.querySelectorAll(".password-toggle").forEach(button => {
        button.addEventListener("click", () => {
            const input = container.querySelector(
                `#${button.dataset.target}`
            );

            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";
            button.textContent = isPassword ? "HIDE" : "SHOW";
        });
    });

    /* SIGN IN SUBMISSION */

    signinForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = container.querySelector(
            "#login-username"
        ).value.trim();

        const password = container.querySelector(
            "#login-password"
        ).value;

        const rememberMe = container.querySelector(
            'input[name="remember"]'
        ).checked;

        if (!username || !password) {
            showMessage("Please enter your username and password.", "error");
            return;
        }

        const submitButton = signinForm.querySelector(".auth-submit");

        submitButton.disabled = true;
        submitButton.textContent = "SIGNING IN...";

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password,
                    rememberMe
                })
            });

            const result = await response.json();

            if (!response.ok) {
                showMessage(
                    result.message || "Login failed.",
                    "error"
                );
                return;
            }

            if (result.success && result.user) {
                onLoginSuccess?.(result.user);
            }

        } catch (error) {
            console.error("Login error:", error);

            showMessage(
                "Unable to connect to the server. Please try again.",
                "error"
            );

        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'SIGN IN <span>→</span>';
        }
    });

    /* SIGN UP SUBMISSION */

    
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const fullName = container.querySelector(
            "#register-name"
        ).value.trim();

        const username = container.querySelector(
            "#register-username"
        ).value.trim();

        const password = container.querySelector(
            "#register-password"
        ).value;

        const confirmPassword = container.querySelector(
            "#confirm-password"
        ).value;

        const basicSalary = container.querySelector(
            "#register-salary"
        ).value;

        // Validate required fields
        if (!fullName || !username || !password || !confirmPassword) {
            showMessage("Please complete all required fields.", "error");
            return;
        }

        // Validate password confirmation
        if (password !== confirmPassword) {
            showMessage("Passwords do not match.", "error");
            return;
        }

        // Validate password length
        if (password.length < 8) {
            showMessage(
                "Password must contain at least 8 characters.",
                "error"
            );
            return;
        }

        const submitButton = signupForm.querySelector(".auth-submit");

        submitButton.disabled = true;
        submitButton.textContent = "CREATING ACCOUNT...";

        try {
            // Send registration data to backend
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName,
                    username,
                    password,
                    confirmPassword,
                    basicSalary
                })
            });

            const result = await response.json();

            if (!response.ok) {
                showMessage(
                    result.message || "Registration failed.",
                    "error"
                );
                return;
            }

            // Registration successful
            signupForm.reset();

            switchAuth("signin");

            showMessage(
                result.message || "Registration successful.",
                "info"
            );

        } catch (error) {
            console.error("Registration error:", error);

            showMessage(
                "Unable to connect to the server. Please try again.",
                "error"
            );

        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'CREATE ACCOUNT <span>→</span>';
        }
    });

}
