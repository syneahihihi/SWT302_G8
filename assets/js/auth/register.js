// ==================== REGISTER ====================
function showRegisterForm(e) {
  if (e) e.preventDefault();
  document.getElementById('login-page').classList.add('hidden');
  document.getElementById('register-page').classList.remove('hidden');
  resetRegisterForm();
}

function showLoginForm(e) {
  if (e) e.preventDefault();
  document.getElementById('register-page').classList.add('hidden');
  document.getElementById('login-page').classList.remove('hidden');
}

function resetRegisterForm() {
  const form = document.getElementById('registerForm');
  if (form) form.reset();
  ['regFullname','regStudentId','regEmail','regPhone','regUsername','regPassword','regConfirmPassword'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('input-error', 'input-ok'); }
  });
  ['errRegFullname','errRegStudentId','errRegEmail','errRegPhone','errRegUsername','errRegPassword','errRegConfirmPassword','errRegTerms'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.add('hidden'); el.textContent = ''; }
  });
  const hint = document.getElementById('hintRegUsername');
  if (hint) { hint.textContent = ''; hint.className = 'field-hint'; }
  const bar = document.getElementById('pwStrengthBar');
  if (bar) bar.style.display = 'none';
  const fill = document.getElementById('pwStrengthFill');
  if (fill) { fill.style.width = '0%'; fill.className = 'pw-strength-fill'; }
  const errBox = document.getElementById('registerError');
  if (errBox) errBox.classList.add('hidden');
  const sucBox = document.getElementById('registerSuccess');
  if (sucBox) sucBox.classList.add('hidden');
  const regBtn = document.getElementById('registerBtn');
  if (regBtn) { regBtn.innerHTML = '<span>Tạo tài khoản</span><span>✨</span>'; regBtn.disabled = false; }
}

function setFieldError(fieldId, errId, msg) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(errId);
  if (field) { field.classList.add('input-error'); field.classList.remove('input-ok'); }
  if (err) { err.textContent = '⚠ ' + msg; err.classList.remove('hidden'); }
}

function clearFieldError(fieldId, errId) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(errId);
  if (field) { field.classList.remove('input-error'); field.classList.add('input-ok'); }
  if (err) { err.classList.add('hidden'); err.textContent = ''; }
}

function checkUsernameAvailable(val) {
  const hint = document.getElementById('hintRegUsername');
  const field = document.getElementById('regUsername');
  if (!hint || !field) return;
  const v = val.trim();
  if (v.length < 3) {
    hint.textContent = '';
    hint.className = 'field-hint';
    field.classList.remove('input-ok', 'input-error');
    return;
  }
  const accounts = DB.get('accounts');
  const taken = accounts.some(a => a.username.toLowerCase() === v.toLowerCase());
  if (taken) {
    hint.textContent = '✗ Tên đăng nhập đã được sử dụng';
    hint.className = 'field-hint taken';
    field.classList.add('input-error');
    field.classList.remove('input-ok');
  } else {
    hint.textContent = '✓ Tên đăng nhập khả dụng';
    hint.className = 'field-hint ok';
    field.classList.remove('input-error');
    field.classList.add('input-ok');
  }
}

function checkPasswordStrength(val) {
  const bar = document.getElementById('pwStrengthBar');
  const fill = document.getElementById('pwStrengthFill');
  const label = document.getElementById('pwStrengthLabel');
  if (!bar || !fill || !label) return;

  if (!val) { bar.style.display = 'none'; return; }
  bar.style.display = 'flex';

  let score = 0;
  if (val.length >= 6) score++;
  if (val.length >= 10) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  if (score <= 1) {
    fill.style.width = '25%';
    fill.className = 'pw-strength-fill weak';
    label.textContent = 'Yếu';
    label.style.color = 'var(--accent-rose)';
  } else if (score <= 3) {
    fill.style.width = '60%';
    fill.className = 'pw-strength-fill medium';
    label.textContent = 'Trung bình';
    label.style.color = 'var(--accent-amber)';
  } else {
    fill.style.width = '100%';
    fill.className = 'pw-strength-fill strong';
    label.textContent = 'Mạnh';
    label.style.color = 'var(--accent-green)';
  }
}

function togglePasswordVisibility(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (!input || !btn) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁';
  }
}

function handleRegister(e) {
  e.preventDefault();

  // Collect values
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
    if (el) { el.classList.remove('input-error', 'input-ok'); }
  });
  ['errRegFullname','errRegStudentId','errRegEmail','errRegPhone','errRegUsername','errRegPassword','errRegConfirmPassword','errRegTerms'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.add('hidden'); el.textContent = ''; }
  });
  document.getElementById('registerError').classList.add('hidden');
  document.getElementById('registerSuccess').classList.add('hidden');

  let hasError = false;

  // ---- Validation ----
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
  const members = DB.get('members');
  const svIdRegex = /^SV\d{3,10}$/i;
  if (!studentId) {
    setFieldError('regStudentId', 'errRegStudentId', 'Mã sinh viên không được để trống');
    hasError = true;
  } else if (!svIdRegex.test(studentId)) {
    setFieldError('regStudentId', 'errRegStudentId', 'Mã sinh viên không hợp lệ (VD: SV2024001)');
    hasError = true;
  } else if (members.some(m => m.code.toLowerCase() === studentId.toLowerCase())) {
    setFieldError('regStudentId', 'errRegStudentId', 'Mã sinh viên đã được đăng ký trong hệ thống');
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
  } else if (members.some(m => m.email.toLowerCase() === email.toLowerCase())) {
    setFieldError('regEmail', 'errRegEmail', 'Email đã được đăng ký trong hệ thống');
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
  const accounts = DB.get('accounts');
  if (!username) {
    setFieldError('regUsername', 'errRegUsername', 'Tên đăng nhập không được để trống');
    hasError = true;
  } else if (!usernameRegex.test(username)) {
    setFieldError('regUsername', 'errRegUsername', 'Tên đăng nhập chỉ được dùng chữ, số, dấu _ và từ 3-30 ký tự');
    hasError = true;
  } else if (accounts.some(a => a.username.toLowerCase() === username.toLowerCase())) {
    setFieldError('regUsername', 'errRegUsername', 'Tên đăng nhập đã được sử dụng, vui lòng chọn tên khác');
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
    if (errTerms) { errTerms.textContent = '⚠ Bạn phải đồng ý với điều khoản sử dụng để tiếp tục'; errTerms.classList.remove('hidden'); }
    hasError = true;
  }

  if (hasError) return;

  // ---- Submit ----
  const btn = document.getElementById('registerBtn');
  btn.innerHTML = '<span>Đang xử lý...</span>';
  btn.disabled = true;

  setTimeout(() => {
    try {
      const now = new Date().toISOString().split('T')[0];
      const newMemberId = 'm' + Date.now();
      const newAccountId = 'acc' + Date.now();

      // Tạo thành viên mới
      const newMember = {
        id: newMemberId,
        code: studentId.toUpperCase(),
        name: fullname,
        email: email,
        phone: phone,
        address: '',
        joinDate: now,
        status: 'active',
      };
      const updatedMembers = [...DB.get('members'), newMember];
      DB.set('members', updatedMembers);

      // Tạo tài khoản mới
      const newAccount = {
        id: newAccountId,
        username: username,
        password: password,
        fullname: fullname,
        email: email,
        role: 'Member',
        memberId: newMemberId,
        status: 'active',
        createdAt: now,
      };
      const updatedAccounts = [...DB.get('accounts'), newAccount];
      DB.set('accounts', updatedAccounts);

      // Show success
      const sucBox = document.getElementById('registerSuccess');
      sucBox.innerHTML = `✅ Đăng ký thành công! Tài khoản <strong>${username}</strong> đã được tạo. Bạn có thể đăng nhập ngay.`;
      sucBox.classList.remove('hidden');

      btn.innerHTML = '<span>Đăng ký thành công</span><span>✅</span>';
      btn.disabled = true;

      showToast('Đăng ký tài khoản thành công!', 'success');

      // Tự động chuyển về login sau 2.5s
      setTimeout(() => {
        showLoginForm();
        document.getElementById('loginUsername').value = username;
        showToast('Vui lòng đăng nhập để tiếp tục', 'info');
      }, 2500);

    } catch (err) {
      const errBox = document.getElementById('registerError');
      errBox.textContent = '❌ Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại.';
      errBox.classList.remove('hidden');
      btn.innerHTML = '<span>Tạo tài khoản</span><span>✨</span>';
      btn.disabled = false;
    }
  }, 700);
}

