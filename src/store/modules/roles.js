import { getRolesList } from '@/api/roles'

const getUserRoes = () => {
  return {
    list: []
  }
}

const state = getUserRoes()

const mutations = {
  SET_ROLES_LIST: (state, list) => {
    state.list = list
  }
}

const actions = {

  getRolesList({ commit, state }) {
    return new Promise((resolve, reject) => {
      getRolesList(state.token).then(res => {
        const { data } = res
        if (!data) {
          reject('获取失败，请稍后重试')
        }
        commit('SET_ROLES_LIST', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
