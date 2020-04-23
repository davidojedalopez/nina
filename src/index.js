  
import { Application } from "stimulus"
import { definitionsFromContext } from "stimulus/webpack-helpers"

const application = Application.start()
const context = require.context("./controllers", true, /\.js$/)
application.load(definitionsFromContext(context))

import './styles/base.css'
import './styles/trix.css'

console.info({application})
console.info({context})

require('./js/trix')