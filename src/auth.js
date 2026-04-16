import { supabase } from './supabase.js'

const ALLOWED_DOMAIN = 'srmist.edu.in'

window.showView = function(view) {
  document.getElementById('loginCard').style.display = view === 'login' ? 'block' : 'none'
  document.getElementById('signupCard').style.display = view === 'signup' ? 'block' : 'none'
  document.getElementById('forgotCard').style.display = view === 'forgot' ? 'block' : 'none'
}

function setError(id, msg) {
  const el = document.getElementById(id)
  if (el) el.textContent = msg
}

function setSuccess(id, msg) {
  const el = document.getElementById(id)
  if (el) el.textContent = msg
}

function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId)
  if (btn) btn.disabled = loading
}

function validateDomain(email) {
  return email.trim().toLowerCase().endsWith('@' + ALLOWED_DOMAIN)
}

document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value.trim()
  const password = document.getElementById('loginPassword').value

  setError('loginError', '')

  if (!email || !password) {
    setError('loginError', 'Please fill in all fields.')
    return
  }

  if (!validateDomain(email)) {
    setError('loginError', 'Only @srmist.edu.in email addresses are allowed.')
    return
  }

  setLoading('loginBtn', true)

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    setError('loginError', error.message)
    setLoading('loginBtn', false)
    return
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', data.user.id)
    .maybeSingle()

  if (profile?.is_admin) {
    window.location.href = '/dashboard.html'
  } else {
    window.location.href = '/profile.html'
  }
})

document.getElementById('signupBtn').addEventListener('click', async () => {
  const email = document.getElementById('signupEmail').value.trim()
  const password = document.getElementById('signupPassword').value
  const confirm = document.getElementById('signupConfirm').value

  setError('signupError', '')
  setSuccess('signupSuccess', '')

  if (!email || !password || !confirm) {
    setError('signupError', 'Please fill in all fields.')
    return
  }

  if (!validateDomain(email)) {
    setError('signupError', 'Only @srmist.edu.in email addresses are allowed.')
    return
  }

  if (password.length < 6) {
    setError('signupError', 'Password must be at least 6 characters.')
    return
  }

  if (password !== confirm) {
    setError('signupError', 'Passwords do not match.')
    return
  }

  setLoading('signupBtn', true)

  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    setError('signupError', error.message)
  } else {
    setSuccess('signupSuccess', 'Account created! You can now log in.')
    setTimeout(() => showView('login'), 2000)
  }

  setLoading('signupBtn', false)
})

document.getElementById('resetBtn').addEventListener('click', async () => {
  const email = document.getElementById('resetEmail').value.trim()

  setError('resetError', '')
  setSuccess('resetSuccess', '')

  if (!email) {
    setError('resetError', 'Please enter your email address.')
    return
  }

  if (!validateDomain(email)) {
    setError('resetError', 'Only @srmist.edu.in email addresses are allowed.')
    return
  }

  setLoading('resetBtn', true)

  const { error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) {
    setError('resetError', error.message)
  } else {
    setSuccess('resetSuccess', 'Reset link sent! Check your inbox.')
    setTimeout(() => showView('login'), 3000)
  }

  setLoading('resetBtn', false)
})
