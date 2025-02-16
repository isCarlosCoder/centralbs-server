export const verifyEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: 'Adicione um email válido',
    }
  }

  return {
    success: true,
    message: '',
  }
}

export const verifyPassword = (password: string) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  if (password.length < 8) {
    return {
      success: false,
      message: 'A senha deve conter pelo menos 8 caracteres',
    }
  }

  if (!passwordRegex.test(password)) {
    return {
      success: false,
      message: 'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um símbolo',
    }
  }

  return {
    success: true,
    message: '',
  }
}
