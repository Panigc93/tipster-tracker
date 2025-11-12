/**
 * @fileoverview Módulo de autenticación
 * @module auth
 */

import { initApp } from '../app.js';
import {closeModal, showLoading} from '../utils/ui-helpers.js';
import { auth, state } from './init.js';

function showAuthTab(tab) {
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(t => t.classList.remove('active'));

    if (tab === 'login') {
        tabs[0].classList.add('active');
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('signupForm').style.display = 'none';
    } else {
        tabs[1].classList.add('active');
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('signupForm').style.display = 'block';
    }
}

function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(inputId + 'Icon');
    if (!input || !icon) return;

    if (input.type === 'password') {
        input.type = 'text';
        icon.setAttribute('data-lucide', 'eye-off');
    } else {
        input.type = 'password';
        icon.setAttribute('data-lucide', 'eye');
    }

    lucide.createIcons();
}

function showForgotPasswordModal() {
    const modal = document.getElementById('forgotPasswordModal');
    const emailInput = document.getElementById('forgotEmail');
    const errorEl = document.getElementById('forgotError');
    const successEl = document.getElementById('forgotSuccess');

    modal.classList.add('active');
    emailInput.value = '';
    errorEl.classList.remove('visible');
    successEl.classList.remove('visible');
    emailInput.focus();
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');

    showLoading(true);
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            errorEl.classList.remove('visible');
        })
        .catch(error => {
            showLoading(false);
            errorEl.textContent = getAuthErrorMessage(error.code);
            errorEl.classList.add('visible');
        });
}

function handleSignup(event) {
    event.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
    const errorEl = document.getElementById('signupError');

    if (password !== passwordConfirm) {
        errorEl.textContent = 'Las contraseñas no coinciden';
        errorEl.classList.add('visible');
        return;
    }

    showLoading(true);
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            errorEl.classList.remove('visible');
        })
        .catch(error => {
            showLoading(false);
            errorEl.textContent = getAuthErrorMessage(error.code);
            errorEl.classList.add('visible');
        });
}

function handleSignOut() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        auth.signOut();
    }
}

function handleForgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById('forgotEmail').value;
    const errorEl = document.getElementById('forgotError');
    const successEl = document.getElementById('forgotSuccess');

    errorEl.classList.remove('visible');
    successEl.classList.remove('visible');
    showLoading(true);

    auth.sendPasswordResetEmail(email)
        .then(() => {
            showLoading(false);
            successEl.classList.add('visible');
            errorEl.classList.remove('visible');
            setTimeout(() => {
                closeModal('forgotPasswordModal');
            }, 3000);
        })
        .catch((error) => {
            showLoading(false);
            errorEl.textContent = getPasswordResetErrorMessage(error.code);
            errorEl.classList.add('visible');
            successEl.classList.remove('visible');
        });
}

function getAuthErrorMessage(code) {
    const errors = {
        'auth/email-already-in-use': 'Este email ya está registrado',
        'auth/invalid-email': 'Email inválido',
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
        'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
        'auth/network-request-failed': 'Error de red. Verifica tu conexión'
    };
    return errors[code] || 'Error de autenticación: ' + code;
}

function getPasswordResetErrorMessage(code) {
    const errors = {
        'auth/user-not-found': 'No existe ninguna cuenta con este email',
        'auth/invalid-email': 'Email inválido',
        'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
        'auth/network-request-failed': 'Error de red. Verifica tu conexión'
    };
    return errors[code] || `Error al enviar email: ${code}`;
}

function setupAuthListeners() {
    auth.onAuthStateChanged(user => {
        if (user) {
            state.currentUser = user;
            document.getElementById('authScreen').style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
            document.getElementById('userEmailDisplay').textContent = user.email;
            initApp();
        } else {
            state.currentUser = null;
            document.getElementById('authScreen').style.display = 'flex';
            document.getElementById('mainApp').style.display = 'none';
            showLoading(false);

            if (state.unsubscribeTipsters) state.unsubscribeTipsters();
            if (state.unsubscribePicks) state.unsubscribePicks();
            if (state.unsubscribeFollows) state.unsubscribeFollows();

            state.tipsters = [];
            state.picks = [];
            state.userFollows = [];
        }
    });

    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('signupForm')?.addEventListener('submit', handleSignup);
    document.getElementById('forgotPasswordForm')?.addEventListener('submit', handleForgotPassword);

    document.getElementById('closeForgotPasswordModal')?.addEventListener('click', () => closeModal('forgotPasswordModal'));
    document.getElementById('cancelForgotPasswordModal')?.addEventListener('click', () => closeModal('forgotPasswordModal'));

    document.getElementById('tabLogin')?.addEventListener('click', () => showAuthTab('login'));
    document.getElementById('tabSignup')?.addEventListener('click', () => showAuthTab('signup'));

    document.getElementById('toggleLoginPassword')?.addEventListener('click', () => togglePasswordVisibility('loginPassword'));
    document.getElementById('toggleSignupPassword')?.addEventListener('click', () => togglePasswordVisibility('signupPassword'));
    document.getElementById('toggleSignupPasswordConfirm')?.addEventListener('click', () => togglePasswordVisibility('signupPasswordConfirm'));

    document.getElementById('forgotPasswordLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        showForgotPasswordModal();
    });

    document.getElementById('signOutBtn')?.addEventListener('click', handleSignOut);
}

export {
    handleSignOut, setupAuthListeners
};

