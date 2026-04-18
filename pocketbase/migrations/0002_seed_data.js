migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    let userRecord
    try {
      userRecord = app.findAuthRecordByEmail('_pb_users_auth_', 'marcelomacbook@me.com')
    } catch (_) {
      userRecord = new Record(users)
      userRecord.setEmail('marcelomacbook@me.com')
      userRecord.setPassword('Skip@Pass')
      userRecord.setVerified(true)
      userRecord.set('name', 'Admin')
      app.save(userRecord)
    }

    const studios = app.findCollectionByNameOrId('studios')
    let studioRecord
    try {
      studioRecord = app.findFirstRecordByData('studios', 'name', 'Studio Noir')
    } catch (_) {
      studioRecord = new Record(studios)
      studioRecord.set('name', 'Studio Noir')
      studioRecord.set('owner', userRecord.id)
      studioRecord.set('status', 'active')
      studioRecord.set(
        'botFirstMessage',
        'Olá! Sou o assistente do Studio Noir. Como posso ajudar?',
      )
      app.save(studioRecord)
    }

    const clients = app.findCollectionByNameOrId('clients')
    let clientRecord
    try {
      clientRecord = app.findFirstRecordByData('clients', 'phone', '5511999999999')
    } catch (_) {
      clientRecord = new Record(clients)
      clientRecord.set('name', 'Mariana Costa')
      clientRecord.set('phone', '5511999999999')
      clientRecord.set('studio', studioRecord.id)
      clientRecord.set('avatar', '')
      clientRecord.set('healthDataConsent', true)
      clientRecord.set('imageRights', true)
      app.save(clientRecord)
    }
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail('_pb_users_auth_', 'marcelomacbook@me.com')
      app.delete(record)
    } catch (_) {}
  },
)
