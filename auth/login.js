/**
 * Pushkara Nigha - Futuristic Login Portal Interface Logic
 * Connects inputs, validation indicators, loading stages, and role selections.
 */

document.addEventListener("DOMContentLoaded", () => {
    // Check if user is already logged in, if so, skip login view entirely
    if (window.Session && window.Session.isActive()) {
        window.Session.protectRoute();
        return;
    }

    const loginOverlay = document.getElementById("login-portal-overlay");
    if (!loginOverlay) return;

    const roleButtons = document.querySelectorAll(".role-switcher-btn");
    const usernameInput = document.getElementById("login-username");
    const passwordInput = document.getElementById("login-password");
    const passwordEye = document.getElementById("login-password-eye");
    const rememberMeCheckbox = document.getElementById("login-remember");
    const submitBtn = document.getElementById("login-submit");
    const submitText = document.getElementById("login-submit-text");
    const spinner = document.querySelector(".login-spinner-circle");
    const validationToast = document.querySelector(".login-validation-toast");
    const validationText = document.getElementById("login-validation-text");
    const forgotLink = document.querySelector(".forgot-pass-link");

    let selectedRole = "admin"; // Default selected role

    // Initialize Lucide icons on login screen
    if (window.lucide) {
        window.lucide.createIcons({
            attrs: { "data-lucide": true },
            nodeList: [loginOverlay]
        });
    }

    // 1. Role Selection Switching Logic
    roleButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            roleButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedRole = btn.dataset.role;

            // Clear previous validation highlights
            clearErrors();

            // Adjust submit button glows based on role aesthetic
            if (selectedRole === 'admin') {
                submitBtn.style.background = "linear-gradient(135deg, #0B6B53, #0D9488)";
                submitBtn.style.boxShadow = "0 4px 15px rgba(13, 148, 136, 0.3)";
            } else {
                submitBtn.style.background = "linear-gradient(135deg, #0D9488, #2DD4BF)";
                submitBtn.style.boxShadow = "0 4px 15px rgba(45, 212, 191, 0.3)";
            }
        });
    });

    // 2. Password Visibility Toggle Eye Icon
    if (passwordEye && passwordInput) {
        passwordEye.addEventListener("click", () => {
            const isPassword = passwordInput.getAttribute("type") === "password";
            passwordInput.setAttribute("type", isPassword ? "text" : "password");

            // Toggle Lucide eye icon
            passwordEye.setAttribute("data-lucide", isPassword ? "eye-off" : "eye");
            if (window.lucide) {
                window.lucide.createIcons({
                    attrs: { "data-lucide": true },
                    nodeList: [passwordEye.parentNode]
                });
            }
        });
    }

    // 3. Trigger Submission on Enter Key inside input boxes
    [usernameInput, passwordInput].forEach(input => {
        if (!input) return;
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleFormSubmit();
            }
        });

        // Clear error glow outline on focus typing
        input.addEventListener("input", () => {
            input.classList.remove("input-error");
            hideValidationToast();
        });
    });

    // 4. Submit Trigger
    if (submitBtn) {
        submitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            handleFormSubmit();
        });
    }

    // 5. Handle Form Submission & Validation flow
    function handleFormSubmit() {
        // Clear previous error states
        clearErrors();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Standard Front-end validations
        let hasErrors = false;
        if (!username) {
            usernameInput.classList.add("input-error");
            hasErrors = true;
        }
        if (!password) {
            passwordInput.classList.add("input-error");
            hasErrors = true;
        }

        if (hasErrors) {
            showValidationError("All access credentials fields are strictly required for security validation.");
            return;
        }

        // Show Loader Spinner state
        submitBtn.disabled = true;
        submitText.textContent = "SYNCHRONIZING FEED...";
        spinner.style.display = "inline-block";
        hideValidationToast();

        // Add 1.2s delay to simulate secure Government neural-iccc handshake clearance checking
        setTimeout(() => {
            if (!window.Auth) {
                resetSubmitBtn();
                showValidationError("Authentication module offline. Telemetry server error.");
                return;
            }

            const response = window.Auth.login(username, password, selectedRole);

            if (response.success) {
                // Success Path UI Transition
                submitText.textContent = "CLEARANCE CONFIRMED";
                submitBtn.style.background = "#10B981";
                submitBtn.style.boxShadow = "0 0 20px rgba(16, 185, 129, 0.6)";
                spinner.style.display = "none";

                // Play Success Banner
                if (window.showSystemBanner) {
                    window.showSystemBanner(response.message);
                }

                // Initialize session state
                if (window.Session) {
                    const rememberMe = rememberMeCheckbox ? rememberMeCheckbox.checked : false;
                    window.Session.start(response.user, rememberMe);

                    // If supervisor is logging in, redirect directly to Monitoring page as fallback
                    if (response.user.role === 'command-supervisor') {
                        setTimeout(() => {
                            // Enforce Routing Protection & hide portal
                            window.Session.protectRoute();
                            
                            // Trigger sidebar transition to Monitoring sector
                            const monitoringNav = document.querySelector(".sidebar-nav-item[href='#monitoring']");
                            if (monitoringNav) {
                                monitoringNav.click();
                            }
                        }, 800);
                    } else {
                        // Admin redirect path
                        setTimeout(() => {
                            window.Session.protectRoute();
                            // Admin goes to default Overview or active tab
                            const activeNav = document.querySelector(".sidebar-nav-item.active");
                            if (activeNav) {
                                const target = activeNav.getAttribute("href").substring(1);
                                // Ensure section transitions correctly
                                document.querySelectorAll(".dashboard-section").forEach(sec => {
                                    if (sec.id === `section-${target}`) sec.classList.add("active");
                                    else sec.classList.remove("active");
                                });
                            }
                        }, 800);
                    }
                }
            } else {
                // Error Path
                resetSubmitBtn();
                showValidationError(response.message);
                
                // Shake validation toast panel
                validationToast.style.animation = "none";
                setTimeout(() => {
                    validationToast.style.animation = "shake 0.4s ease-in-out";
                }, 10);
            }
        }, 1200);
    }

    // Forgot Password Action HUD message
    if (forgotLink) {
        forgotLink.addEventListener("click", (e) => {
            e.preventDefault();
            if (window.showSystemBanner) {
                window.showSystemBanner("Alert: Present your RFID Secure Command pass to local sector admin for credential resets.");
            } else {
                alert("ICCC Security Protocols: Please contact your local District Command Admin to request account passcode overrides.");
            }
        });
    }

    // Helper: Reset button state
    function resetSubmitBtn() {
        submitBtn.disabled = false;
        submitText.textContent = "CONFIRM COMMAND ACCESS";
        spinner.style.display = "none";
        
        // Reset role styles
        if (selectedRole === 'admin') {
            submitBtn.style.background = "linear-gradient(135deg, #0B6B53, #0D9488)";
        } else {
            submitBtn.style.background = "linear-gradient(135deg, #0D9488, #2DD4BF)";
        }
    }

    // Helper: Show validation panel
    function showValidationError(message) {
        if (validationToast && validationText) {
            validationText.textContent = message;
            validationToast.style.display = "flex";
        }
    }

    // Helper: Hide validation panel
    function hideValidationToast() {
        if (validationToast) {
            validationToast.style.display = "none";
        }
    }

    // Helper: Clear outline inputs
    function clearErrors() {
        if (usernameInput) usernameInput.classList.remove("input-error");
        if (passwordInput) passwordInput.classList.remove("input-error");
        hideValidationToast();
    }
});
