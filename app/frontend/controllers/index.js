import { application } from './application'

const controllers = import.meta.glob('./*_controller.js', { eager: true })
Object.entries(controllers).forEach(([path, module]) => {
  const name = path.match(/\.\/(.*)_controller\.js/)[1].replace(/_/g, '-')
  application.register(name, module.default)
})
