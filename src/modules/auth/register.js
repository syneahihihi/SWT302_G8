import { showToast } from '../../core/toast.js';

export function showRegisterForm(e) {
  if (e) e.preventDefault();
  document.getElementById('login-page').classList.add('d-none');
  document.getElementById('register-page').classList.remove('d-none');
  resetRegisterForm();
}

export function showLoginForm(e) {
  if (e) e.preventDefault();
  document.getElementById('register-page').classList.add('d-none');
  document.getElementById('login-page').classList.remove('d-none');
}

export function resetRegisterForm() {
  const form = document.getElementById('registerForm');
  if (form) form.reset();
  ['regFullname','regStudentId','regEmail','regPhone','regUsername','regPassword','regConfirmPassword'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('is-invalid', 'is-valid'); }
  });
  ['errRegFullname','errRegStudentId','errRegEmail','errRegPhone','errRegUsername','errRegPassword','errRegConfirmPassword','errRegTerms'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.add('d-none'); el.textContent = ''; }
  });
  const hint = document.getElementById('hintRegUsername');
  if (hint) { hint.textContent = ''; hint.className = 'form-text'; }
  const barContainer = document.getElementById('pwStrengthBar');
  if (barContainer) barContainer.style.display = 'none';
  const fill = document.getElementById('pwStrengthFill');
  if (fill) { fill.style.width = '0%'; fill.className = 'progress-bar'; }
  const errBox = document.getElementById('registerError');
  if (errBox) errBox.classList.add('d-none');
  const sucBox = document.getElementById('registerSuccess');
  if (sucBox) sucBox.classList.add('d-none');
  const regBtn = document.getElementById('registerBtn');
  if (regBtn) { regBtn.innerHTML = '<span>Tạo tài khoản</span> <i class="bi bi-sparkles"></i>'; regBtn.disabled = false; }
}

export function setFieldError(fieldId, errId, msg) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(errId);
  if (field) { field.classList.add('is-invalid'); field.classList.remove('is-valid'); }
  if (err) { err.textContent = msg; err.classList.remove('d-none'); }
}

export function clearFieldError(fieldId, errId) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(errId);
  if (field) { field.classList.remove('is-invalid'); field.classList.add('is-valid'); }
  if (err) { err.classList.add('d-none'); err.textContent = ''; }
}

export function checkUsernameAvailable(val) {
  const hint = document.getElementById('hintRegUsername');
  const field = document.getElementById('regUsername');
  if (!hint || !field) return;
  const v = val.trim();
  if (v.length < 3) {
    hint.textContent = '';
    hint.className = 'form-text';
    field.classList.remove('is-valid', 'is-invalid');
    return;
  }
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  if (!usernameRegex.test(v)) {
    hint.textContent = 'Tên đăng nhập chỉ được dùng chữ, số, dấu _ và từ 3-30 ký tự';
    hint.className = 'form-text text-danger';
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
  } else {
    hint.textContent = 'Định dạng tên đăng nhập hợp lệ';
    hint.className = 'form-text text-success';
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
  }
}

export function checkPasswordStrength(val) {
  const barContainer = document.getElementById('pwStrengthBar');
  const fill = document.getElementById('pwStrengthFill');
  const label = document.getElementById('pwStrengthLabel');
  if (!barContainer || !fill || !label) return;

  if (!val) { barContainer.style.display = 'none'; return; }
  barContainer.style.display = 'block';

  let score = 0;
  if (val.length >= 6) score++;
  if (val.length >= 10) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  if (score <= 1) {
    fill.style.width = '25%';
    fill.className = 'progress-bar bg-danger';
    label.textContent = 'Yếu';
  } else if (score <= 3) {
    fill.style.width = '60%';
    fill.className = 'progress-bar bg-warning';
    label.textContent = 'Trung bình';
  } else {
    fill.style.width = '100%';
    fill.className = 'progress-bar bg-success';
    label.textContent = 'Mạnh';
  }
}

export function togglePasswordVisibility(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (!input || !btn) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<i class="bi bi-eye-slash-fill"></i>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<i class="bi bi-eye-fill"></i>';
  }
}

export function handleRegister(e) {
  e.preventDefault();

  const fullname = document.getElementById('regFullname').value.trim();
  const studentId = document.getElementById('regStudentId').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  const terms = document.getElementById('regTerms').checked;

  // Clear all errors first
  ['regFullname','regStudentId','regEmail','regPhone','regUsername','regPassword','regConfirmPassword'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('is-invalid', 'is-valid'); }
  });
  ['errRegFullname','errRegStudentId','errRegEmail','errRegPhone','errRegUsername','errRegPassword','errRegConfirmPassword','errRegTerms'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.add('d-none'); el.textContent = ''; }
  });
  document.getElementById('registerError').classList.add('d-none');
  document.getElementById('registerSuccess').classList.add('d-none');

  let hasError = false;

  // Họ tên
  if (!fullname) {
    setFieldError('regFullname', 'errRegFullname', 'Họ và tên không được để trống');
    hasError = true;
  } else if (fullname.length < 2) {
    setFieldError('regFullname', 'errRegFullname', 'Họ và tên phải có ít nhất 2 ký tự');
    hasError = true;
  } else if (fullname.length > 100) {
    setFieldError('regFullname', 'errRegFullname', 'Họ và tên không được vượt quá 100 ký tự');
    hasError = true;
  } else {
    clearFieldError('regFullname', 'errRegFullname');
  }

  // Mã sinh viên
  const svIdRegex = /^SV\d{3,10}$/i;
  if (!studentId) {
    setFieldError('regStudentId', 'errRegStudentId', 'Mã sinh viên không được để trống');
    hasError = true;
  } else if (!svIdRegex.test(studentId)) {
    setFieldError('regStudentId', 'errRegStudentId', 'Mã sinh viên không hợp lệ (VD: SV2024001)');
    hasError = true;
  } else {
    clearFieldError('regStudentId', 'errRegStudentId');
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    setFieldError('regEmail', 'errRegEmail', 'Email không được để trống');
    hasError = true;
  } else if (!emailRegex.test(email)) {
    setFieldError('regEmail', 'errRegEmail', 'Email không đúng định dạng (VD: user@example.com)');
    hasError = true;
  } else {
    clearFieldError('regEmail', 'errRegEmail');
  }

  // Số điện thoại
  const phoneRegex = /^(0|\+84)[3-9]\d{8}$/;
  if (!phone) {
    setFieldError('regPhone', 'errRegPhone', 'Số điện thoại không được để trống');
    hasError = true;
  } else if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    setFieldError('regPhone', 'errRegPhone', 'Số điện thoại không hợp lệ (VD: 0901234567)');
    hasError = true;
  } else {
    clearFieldError('regPhone', 'errRegPhone');
  }

  // Tên đăng nhập
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  if (!username) {
    setFieldError('regUsername', 'errRegUsername', 'Tên đăng nhập không được để trống');
    hasError = true;
  } else if (!usernameRegex.test(username)) {
    setFieldError('regUsername', 'errRegUsername', 'Tên đăng nhập chỉ được dùng chữ, số, dấu _ và từ 3-30 ký tự');
    hasError = true;
  } else {
    clearFieldError('regUsername', 'errRegUsername');
  }

  // Mật khẩu
  if (!password) {
    setFieldError('regPassword', 'errRegPassword', 'Mật khẩu không được để trống');
    hasError = true;
  } else if (password.length < 6) {
    setFieldError('regPassword', 'errRegPassword', 'Mật khẩu phải có ít nhất 6 ký tự');
    hasError = true;
  } else if (password.length > 100) {
    setFieldError('regPassword', 'errRegPassword', 'Mật khẩu không được vượt quá 100 ký tự');
    hasError = true;
  } else {
    clearFieldError('regPassword', 'errRegPassword');
  }

  // Xác nhận mật khẩu
  if (!confirmPassword) {
    setFieldError('regConfirmPassword', 'errRegConfirmPassword', 'Vui lòng nhập lại mật khẩu');
    hasError = true;
  } else if (confirmPassword !== password) {
    setFieldError('regConfirmPassword', 'errRegConfirmPassword', 'Mật khẩu xác nhận không khớp');
    hasError = true;
  } else {
    clearFieldError('regConfirmPassword', 'errRegConfirmPassword');
  }

  // Điều khoản
  if (!terms) {
    const errTerms = document.getElementById('errRegTerms');
    if (errTerms) { errTerms.textContent = 'Bạn phải đồng ý với điều khoản sử dụng để tiếp tục'; errTerms.classList.remove('d-none'); }
    hasError = true;
  }

  if (hasError) return;

  const btn = document.getElementById('registerBtn');
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Đang xử lý...';
  btn.disabled = true;

  const payload = {
    code: studentId.toUpperCase(),
    address: '',
    status: 'active',
    account: {
      username: username,
      password: password,
      email: email,
      fullname: fullname,
      phone: phone,
      status: 'active',
      role: 'Member'
    }
  };

  fetch('/members', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(async res => {
    if (!res.ok) {
      const errText = await res.text();
      let errMsg = 'Có lỗi xảy ra khi tạo tài khoản.';
      try {
        const errObj = JSON.parse(errText);
        errMsg = errObj.message || errObj.error || errMsg;
      } catch (e) {
        if (errText) errMsg = errText;
      }
      throw new Error(errMsg);
    }
    return res.json();
  })
  .then(data => {
    const sucBox = document.getElementById('registerSuccess');
    sucBox.innerHTML = `<i class="bi bi-check-circle-fill me-1"></i> Đăng ký thành công! Tài khoản <strong>${username}</strong> đã được tạo. Bạn có thể đăng nhập ngay.`;
    sucBox.classList.remove('d-none');

    btn.innerHTML = '<span>Đăng ký thành công</span> <i class="bi bi-check2-circle"></i>';
    btn.disabled = true;

    showToast('Đăng ký tài khoản thành công!', 'success');

    setTimeout(() => {
      showLoginForm();
      document.getElementById('loginUsername').value = username;
      showToast('Vui lòng đăng nhập để tiếp tục', 'info');
    }, 2500);
  })
  .catch(err => {
    const errBox = document.getElementById('registerError');
    errBox.innerHTML = `<i class="bi bi-x-circle-fill me-1"></i> ${err.message}`;
    errBox.classList.remove('d-none');
    btn.innerHTML = '<span>Tạo tài khoản</span> <i class="bi bi-sparkles"></i>';
    btn.disabled = false;
  });
}
