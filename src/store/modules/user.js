import { login, logout, getInfo, userRegister } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    nickname: '',
    email: '',
    motto: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_NICKNAME: (state, nickname) => {
    state.nickname = nickname
  },
  SET_MOTTO: (state, motto) => {
    state.motto = motto
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        console.log(response)
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      console.log('准备getInfo')
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { username, avatar, email, nickname, motto } = data

        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        commit('SET_EMAIL', email)
        commit('SET_NICKNAME', nickname)
        commit('SET_MOTTO', motto)

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  register({ commit }, userInfo) {
    const { username, password, email } = userInfo
    return new Promise((resolve, reject) => {
      userRegister({ username: username.trim(), password: password, email: email }).then(response => {
        console.log(response)
        const { data } = response
        console.log(data)
        // todo:实现注册后自动登录
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout({ 'token': state.token }).then(res => {
        console.log(res)
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

