const { series } = require('gulp')
const { execSync, spawnSync, spawn, exec } = require('child_process')

const services = [
  'service-aaron',
  'searchbar-service',
  'David-service',
  'service-blake'
]

const tasks = {
  clone: function(cb) {
    const child = spawn(
      `git clone https://github.com/objectobject-hr/proxy-blake.git`,
      { shell: true }
    )
    child.on('error', err => console.error(err))
    child.stdout.on('data', data => console.log(data))
    services.forEach(service => {
      const child = spawn(
        `git clone https://github.com/objectobject-hr/${service}.git`,
        { shell: true }
      )
      child.on('error', err => console.error(err))
    })
    cb()
  },

  npmI: function(cb) {
    const folders = [...services]
    const promises = []
    console.log('\n----------')
    promises.push(childPromise('npm i', 'front-end-capstone'))
    folders.forEach(folder =>
      promises.push(childPromise(`cd ${folder} && npm i`, folder))
    )
    console.log('----------')
    Promise.all(promises).then(() => cb())

    function childPromise(command, folder) {
      return new Promise((resolve, reject) => {
        console.log(`\ninstalling packages for ${folder} . . .\n`)
        const child = spawn(command, { shell: true })
        child.on('error', err => {
          console.error(err)
          reject()
        })
        child.on('close', () => {
          console.log(`\n${folder} finished installing packages\n`)
          resolve()
        })
      })
    }
  },

  fix: function(cb) {
    services.forEach(service =>
      execSync(`cd ${service} && npm audit fix`, { stdio: 'inherit' })
    )
    cb()
  },

  pull: function(cb) {
    execSync('git pull', { stdio: 'inherit' })
    execSync('cd proxy-blake && git pull', { stdio: 'inherit' })
    console.log(`\n\n ---------- proxy ${'proxy'}  \n\n`)
    services.forEach((service, i) => {
      execSync(`cd ${service} && git pull`, { stdio: 'inherit' })
      console.log(`\n\n ---------- ${service}  \n\n`)
    })
    cb()
  },

  build: function(cb) {
    execSync('webpack -d', { stdio: 'inherit' })
    cb()
  },

  start: function(cb) {
    const startScripts = []
    services.map(service => startScripts.push(`"cd ${service} && npm start"`))
    let startScript =
      'concurrently ' + startScripts.reduce((a, b) => a + ' ' + b)
    startScript += ' "npm start" "webpack -d"'
    const child = exec(startScript)
    child.stdout.on('data', data => console.log(data.toString()))
    cb()
  },

  dev: function(cb) {
    const startScripts = []
    services.map(service => startScripts.push(`"cd ${service} && npm start"`))
    let startScript =
      'concurrently ' + startScripts.reduce((a, b) => a + ' ' + b)
    startScript += ' "npm start" "webpack -d --watch"'
    const child = exec(startScript)
    child.stdout.on('data', data => console.log(data.toString()))
    cb()
  },

  seed: function(cb) {
    const seeds = [
      'David-service/database/seed.js',
      'service-blake/db/seed.js',
      'service-aaron/database/seed.js'
    ]

    console.log('\n\n')

    seeds.map(seed => {
      const child = spawnSync(`node ${seed}`, {
        shell: true
      })
      console.log(child.stdout.toString())
      console.log('\n\n----------\n\n')
    })

    cb()
  }
}

module.exports = {
  ...tasks
}
