migrate(
  (app) => {
    const studios = new Collection({
      name: 'studios',
      type: 'base',
      listRule: "@request.auth.id != '' && owner = @request.auth.id",
      viewRule: "@request.auth.id != '' && owner = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && owner = @request.auth.id",
      deleteRule: "@request.auth.id != '' && owner = @request.auth.id",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'text' },
        {
          name: 'owner',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'contactPhone', type: 'text' },
        { name: 'contactEmail', type: 'text' },
        { name: 'address', type: 'text' },
        { name: 'location', type: 'text' },
        { name: 'status', type: 'text' },
        { name: 'mrr', type: 'number' },
        { name: 'botFirstMessage', type: 'text' },
        { name: 'recoveryMessage', type: 'text' },
        { name: 'depositPercentage', type: 'number' },
        { name: 'availabilitySearchMargin', type: 'number' },
        { name: 'tattooStyleConfigs', type: 'json' },
        { name: 'zapiInstanceId', type: 'text' },
        { name: 'zapiToken', type: 'text' },
        { name: 'googleCalendarConnected', type: 'bool' },
        { name: 'billingCycleEnd', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(studios)

    const clients = new Collection({
      name: 'clients',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'text' },
        {
          name: 'studio',
          type: 'relation',
          required: true,
          collectionId: studios.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'avatar', type: 'url' },
        { name: 'totalSpent', type: 'number' },
        { name: 'healthDataConsent', type: 'bool' },
        { name: 'imageRights', type: 'bool' },
        { name: 'consentTimestamp', type: 'text' },
        { name: 'consentIp', type: 'text' },
        { name: 'referenceType', type: 'text' },
        { name: 'referenceImage', type: 'url' },
        { name: 'history', type: 'json' },
        { name: 'healthAlerts', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ["CREATE UNIQUE INDEX idx_clients_phone ON clients (phone) WHERE phone != ''"],
    })
    app.save(clients)

    const appointments = new Collection({
      name: 'appointments',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'studio',
          type: 'relation',
          required: true,
          collectionId: studios.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'client',
          type: 'relation',
          required: true,
          collectionId: clients.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'date', type: 'date' },
        { name: 'time', type: 'text' },
        {
          name: 'status',
          type: 'select',
          values: [
            'scheduled',
            'completed',
            'cancelled',
            'pending',
            'pending_confirmation',
            'confirmed',
          ],
          maxSelect: 1,
        },
        { name: 'notes', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'duration', type: 'number' },
        { name: 'totalValue', type: 'number' },
        { name: 'depositPaid', type: 'number' },
        { name: 'paymentStatus', type: 'text' },
        { name: 'financialStatus', type: 'text' },
        { name: 'rescheduleLink', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(appointments)

    const messages = new Collection({
      name: 'messages',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'studio',
          type: 'relation',
          required: true,
          collectionId: studios.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'client',
          type: 'relation',
          required: true,
          collectionId: clients.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'content', type: 'text' },
        {
          name: 'sender_type',
          type: 'select',
          values: ['studio', 'client', 'system', 'bot'],
          required: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(messages)
  },
  (app) => {
    app.delete(app.findCollectionByNameOrId('messages'))
    app.delete(app.findCollectionByNameOrId('appointments'))
    app.delete(app.findCollectionByNameOrId('clients'))
    app.delete(app.findCollectionByNameOrId('studios'))
  },
)
