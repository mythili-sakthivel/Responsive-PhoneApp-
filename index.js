function showError(inputEl, errorEl, message) {
    inputEl.classList.add('input-error');
    inputEl.classList.remove('input-success');
    errorEl.textContent = message;
}

function showFieldSuccess(inputEl, errorEl) {
    inputEl.classList.remove('input-error');
    inputEl.classList.add('input-success');
    errorEl.textContent = '';
}

function clearField(inputEl, errorEl) {
    inputEl.classList.remove('input-error', 'input-success');
    errorEl.textContent = '';
}

document.querySelectorAll('.toggle-password').forEach(function(btn) {
    btn.addEventListener('click', function() {
        var targetId = this.getAttribute('data-target');
        var inputEl = document.getElementById(targetId);
        var eyeIcon = this.querySelector('.eye-icon');

        if (inputEl.type === 'password') {
            inputEl.type = 'text';
            eyeIcon.textContent = '🙈';
        } else {
            inputEl.type = 'password';
            eyeIcon.textContent = '👁️';
        }
    });
});
var signupForm = document.getElementById('signupForm');

if (signupForm) {

    // Live inline validation on blur
    var signupFields = [
        { id: 'fullName',        errorId: 'fullNameError' },
        { id: 'signupEmail',     errorId: 'emailError' },
        { id: 'phone',           errorId: 'phoneError' },
        { id: 'location',        errorId: 'locationError' },
        { id: 'signupPassword',  errorId: 'passwordError' },
        { id: 'confirmPassword', errorId: 'confirmPasswordError' }
    ];

    signupFields.forEach(function(field) {
        var inputEl    = document.getElementById(field.id);
        var errorEl    = document.getElementById(field.errorId);

        // Validate on blur (when user leaves field)
        inputEl.addEventListener('blur', function() {
            validateSignupField(field.id, inputEl, errorEl);
        });

        // Clear error as user types
        inputEl.addEventListener('input', function() {
            if (inputEl.classList.contains('input-error')) {
                validateSignupField(field.id, inputEl, errorEl);
            }
        });
    });

    /**
     * Validates a single signup field
     * Returns true if valid
     */
    function validateSignupField(fieldId, inputEl, errorEl) {
        var value = inputEl.value.trim();

        if (fieldId === 'fullName') {
            if (value === '') {
                showError(inputEl, errorEl, 'Full name is required');
                return false;
            } else if (value.length < 3) {
                showError(inputEl, errorEl, 'Name must be at least 3 characters');
                return false;
            }
        }

        if (fieldId === 'signupEmail') {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value === '') {
                showError(inputEl, errorEl, 'Email is required');
                return false;
            } else if (!emailRegex.test(value)) {
                showError(inputEl, errorEl, 'Enter a valid email (e.g. example@mail.com)');
                return false;
            }
        }

        if (fieldId === 'phone') {
            var phoneRegex = /^\d{10}$/;
            if (value === '') {
                showError(inputEl, errorEl, 'Phone number is required');
                return false;
            } else if (!phoneRegex.test(value)) {
                showError(inputEl, errorEl, 'Phone number must be exactly 10 digits');
                return false;
            }
        }

        if (fieldId === 'location') {
            var alphaRegex = /^[A-Za-z\s]+$/;
            if (value === '') {
                showError(inputEl, errorEl, 'Location/City is required');
                return false;
            } else if (!alphaRegex.test(value)) {
                showError(inputEl, errorEl, 'Location must contain alphabets only');
                return false;
            }
        }

        if (fieldId === 'signupPassword') {
            var pwRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
            if (value === '') {
                showError(inputEl, errorEl, 'Password is required');
                return false;
            } else if (!pwRegex.test(value)) {
                showError(inputEl, errorEl, 'Min 8 characters with at least one letter and one number');
                return false;
            }
        }

        if (fieldId === 'confirmPassword') {
            var password = document.getElementById('signupPassword').value.trim();
            if (value === '') {
                showError(inputEl, errorEl, 'Please confirm your password');
                return false;
            } else if (value !== password) {
                showError(inputEl, errorEl, 'Passwords do not match');
                return false;
            }
        }

        // All checks passed
        showFieldSuccess(inputEl, errorEl);
        return true;
    }

    // Signup Form Submit
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var successMsg = document.getElementById('signupSuccess');
        successMsg.textContent = '';

        // Validate all fields
        var allValid = true;

        signupFields.forEach(function(field) {
            var inputEl = document.getElementById(field.id);
            var errorEl = document.getElementById(field.errorId);
            var result  = validateSignupField(field.id, inputEl, errorEl);
            if (!result) allValid = false;
        });

        if (!allValid) return;

        // Collect user data
        var userData = {
            fullName: document.getElementById('fullName').value.trim(),
            email:    document.getElementById('signupEmail').value.trim().toLowerCase(),
            phone:    document.getElementById('phone').value.trim(),
            location: document.getElementById('location').value.trim(),
            password: document.getElementById('signupPassword').value.trim()
        };

        // Save to localStorage (array of users)
        var users = JSON.parse(localStorage.getItem('nextrip_users') || '[]');

        // Check if email already registered
        var emailExists = users.some(function(u) {
            return u.email === userData.email;
        });

        if (emailExists) {
            var emailInput = document.getElementById('signupEmail');
            var emailError = document.getElementById('emailError');
            showError(emailInput, emailError, 'This email is already registered. Please sign in.');
            return;
        }

        users.push(userData);
        localStorage.setItem('nextrip_users', JSON.stringify(users));

        // Show success & reset
        successMsg.textContent = '✓ Account created! Redirecting to Sign In...';
        signupForm.reset();

        // Clear all success states
        signupFields.forEach(function(field) {
            var inputEl = document.getElementById(field.id);
            var errorEl = document.getElementById(field.errorId);
            clearField(inputEl, errorEl);
        });

        // Redirect to sign in after 2 seconds
        setTimeout(function() {
            window.location.href = 'SignIn.html';
        }, 2000);
    });
  }

var signinForm = document.getElementById('signinForm');

if (signinForm) {

    var signinFields = [
        { id: 'signinEmail',    errorId: 'signinEmailError' },
        { id: 'signinPassword', errorId: 'signinPasswordError' }
    ];

    signinFields.forEach(function(field) {
        var inputEl = document.getElementById(field.id);
        var errorEl = document.getElementById(field.errorId);

        inputEl.addEventListener('blur', function() {
            validateSigninField(field.id, inputEl, errorEl);
        });

        inputEl.addEventListener('input', function() {
            if (inputEl.classList.contains('input-error')) {
                validateSigninField(field.id, inputEl, errorEl);
            }
        });
    });

    function validateSigninField(fieldId, inputEl, errorEl) {
        var value = inputEl.value.trim();

        if (fieldId === 'signinEmail') {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value === '') {
                showError(inputEl, errorEl, 'Email is required');
                return false;
            } else if (!emailRegex.test(value)) {
                showError(inputEl, errorEl, 'Enter a valid email (e.g. example@mail.com)');
                return false;
            }
        }

        if (fieldId === 'signinPassword') {
            if (value === '') {
                showError(inputEl, errorEl, 'Password is required');
                return false;
            }
        }

        showFieldSuccess(inputEl, errorEl);
        return true;
    }

    signinForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var signinError   = document.getElementById('signinError');
        var signinSuccess = document.getElementById('signinSuccess');
        signinError.textContent   = '';
        signinSuccess.textContent = '';

        // Validate fields
        var allValid = true;
        signinFields.forEach(function(field) {
            var inputEl = document.getElementById(field.id);
            var errorEl = document.getElementById(field.errorId);
            if (!validateSigninField(field.id, inputEl, errorEl)) allValid = false;
        });

        if (!allValid) return;

        var enteredEmail    = document.getElementById('signinEmail').value.trim().toLowerCase();
        var enteredPassword = document.getElementById('signinPassword').value.trim();

        // Lookup in localStorage
        var users = JSON.parse(localStorage.getItem('nextrip_users') || '[]');
        var matchedUser = users.find(function(u) {
            return u.email === enteredEmail && u.password === enteredPassword;
        });

        if (!matchedUser) {
            // Check if email exists at all
            var emailExists = users.some(function(u) { return u.email === enteredEmail; });

            if (!emailExists) {
                signinError.textContent = '✗ Email not registered. Please sign up first.';
            } else {
                signinError.textContent = '✗ Incorrect password. Please try again.';
            }
            return;
        }

        // Auth success
        localStorage.setItem('nextrip_loggedIn', JSON.stringify({ email: matchedUser.email, name: matchedUser.fullName }));
        signinSuccess.textContent = '✓ Welcome back, ' + matchedUser.fullName + '! Redirecting...';

        setTimeout(function() {
            window.location.href = 'travelapp.html';
        }, 1500);
    });
}
var menuToggle = document.getElementById('menuToggle');
var mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
    var mobileButtons = document.querySelectorAll('.mobile-btn');

    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    mobileButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', function(event) {
        var isClickInMenu   = mobileMenu.contains(event.target);
        var isClickOnToggle = menuToggle.contains(event.target);

        if (!isClickInMenu && !isClickOnToggle && mobileMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
}
var contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var nameInput    = document.getElementById('name');
        var emailInput   = document.getElementById('email');
        var messageInput = document.getElementById('message');

        var nameError    = document.getElementById('nameError');
        var emailError   = document.getElementById('emailError');
        var messageError = document.getElementById('messageError');
        var successMsg   = document.getElementById('successMsg');

        // Reset
        nameError.textContent    = '';
        emailError.textContent   = '';
        messageError.textContent = '';
        successMsg.textContent   = '';

        nameInput.classList.remove('error');
        emailInput.classList.remove('error');
        messageInput.classList.remove('error');

        var isValid = true;

        var name = nameInput.value.trim();
        if (name === '') {
            nameError.textContent = 'Please enter your name';
            nameInput.classList.add('error');
            isValid = false;
        } else if (name.length < 3) {
            nameError.textContent = 'Name must be at least 3 characters';
            nameInput.classList.add('error');
            isValid = false;
        }

        var email      = emailInput.value.trim();
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '') {
            emailError.textContent = 'Please enter your email';
            emailInput.classList.add('error');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailInput.classList.add('error');
            isValid = false;
        }

        var message = messageInput.value.trim();
        if (message === '') {
            messageError.textContent = 'Please enter your message';
            messageInput.classList.add('error');
            isValid = false;
        } else if (message.length < 10) {
            messageError.textContent = 'Message must be at least 10 characters';
            messageInput.classList.add('error');
            isValid = false;
        }

        if (isValid) {
            successMsg.textContent = '✓ Message sent successfully! We will contact you soon.';
            contactForm.reset();
            setTimeout(function() {
                successMsg.textContent = '';
            }, 5000);
        }
    });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            var target = document.querySelector(href);
            if (target) {
                if (menuToggle) menuToggle.classList.remove('active');
                if (mobileMenu) mobileMenu.classList.remove('active');

                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

console.log('NEXTRIP - Adventure Awaits You');