import { application } from './application'

const jsControllers = import.meta.glob('./*_controller.js', { eager: true })
Object.entries(jsControllers).forEach(([path, module]) => {
  const name = path.match(/\.\/(.*)_controller\.js/)[1].replace(/_/g, '-')
  application.register(name, module.default)
})

const tsControllers = import.meta.glob('./*_controller.ts', { eager: true })
Object.entries(tsControllers).forEach(([path, module]) => {
  const name = path.match(/\.\/(.*)_controller\.ts/)[1].replace(/_/g, '-')
  application.register(name, module.default)
})
