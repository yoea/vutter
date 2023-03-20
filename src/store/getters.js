const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.nickname,
  email: state => state.user.email,
  name: state => state.user.name,
  motto: state => state.user.motto
}
export default getters
