  
require('trix')
require('./js/trix_custom_toolbar')

import { Application } from "stimulus"
import { definitionsFromContext } from "stimulus/webpack-helpers"

const application = Application.start()
const context = require.context("./controllers", true, /\.js$/)
application.load(definitionsFromContext(context))

import Amplify, { Storage } from 'aws-amplify'
import awsconfig from './aws-exports'
Amplify.configure(awsconfig)

import './styles/base.css'
import './styles/trix.css'

import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

// import './styles/application.scss'

