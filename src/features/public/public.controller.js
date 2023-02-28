const Data = require('../../shared/resources/data')

// const contactUs = (req, res) => {
//   console.log(req.body)
//   const firstName = req.body.first_name
//   const lastName = req.body.last_name
//   const message = req.body.message

//   const responseMessage = `Message received from ${firstName} ${lastName}`

//   console.log(responseMessage)
//   res.send(responseMessage)
// }

const calculateQuote = (req, res) => {
  try {
    const type = req.params.type.toLowerCase()
    console.log(type)
    if (!Data.installTypes.includes(type)) {
      res.status(400)
      res.send(`Error: invalid type. Must be 'residential', 'commercial' or 'industrial'`)
      return
    }
    if (type === 'redidential') {
      calculateResidentialQuote(req, res)
    } else if (type === 'commercial') {
      calculateCommercialQuote(req, res)
    } else {
      calculateIndustrialQuote(req, res)
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: `${err.message}` })
  }
}

const calculateIndustrialQuote = (req, res) => {
  try {
    const elevs = req.query.elevs
    const tier = req.query.tier.toLowerCase()

    // validate request object
    if (!Object.keys(Data.unitPrices).includes(tier)) {
      res.status(400)
      return res.send(`Error: invalid tier. Must be 'standard', 'premium' or 'excelium'`)
    }
    if (!parseInt(elevs)) {
      res.status(400)
      return res.send(`Error: 'elevs' query param must be an integer.`)
    }
    if (elevs < 1) {
      res.status(400)
      return res.send(`'elevs' query param must be greater than zero`)
    }

    const totalCost = calcInstallFee(elevs, tier)

    res.send({
      elevators_required: elevs,
      cost: totalCost,
      tier: tier
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: `${err.message}` })
  }
}

const calculateResidentialQuote = (req, res) => {

  // define constants
  const apts = +req.query.apts
  const floors = +req.query.floors
  const tier = req.query.tier.toLowerCase()

  // validate request object
  if (!Object.keys(Data.unitPrices).includes(tier)) {
    res.status(400)
    return res.send(`Error: invalid tier. Must be 'standard', 'premium' or 'excelium'`)
  }

  if (isNaN(floors) || isNaN(apts)) {
    res.status(400)
    return res.send(`Error: apts and floors must be specified as numbers`)
  }

  if (!Number.isInteger(floors) || !Number.isInteger(apts)) {
    res.status(400)
    return res.send(`Error: apts and floors must be integers`)
  }

  if (floors < 1 || apts < 1) {
    res.status(400)
    return res.send(`apts and floors must be greater than zero`)
  }

  // business logic
  const numElevators = calcResidentialElev(floors, apts)
  const totalCost = calcInstallFee(numElevators, tier)

  // format response
  res.send({
    elevators_required: numElevators,
    cost: totalCost
  })
}

const calculateCommercialQuote = (req, res) => {

  // define constants
  const apts = +req.query.apts
  const floors = +req.query.floors
  const tier = req.query.tier.toLowerCase()

  // validate request object
  if (!Object.keys(Data.unitPrices).includes(tier)) {
    res.status(400)
    res.send(`Error: invalid tier`)
    return
  }

  if (isNaN(floors) || isNaN(apts)) {
    res.status(400)
    res.send(`Error: apts and floors must be specified as numbers`)
    return
  }

  if (!Number.isInteger(floors) || !Number.isInteger(apts)) {
    res.status(400)
    res.send(`Error: apts and floors must be integers`)
    return
  }

  if (floors < 1 || apts < 1) {
    res.status(400)
    res.send(`apts and floors must be greater than zero`)
    return
  }

  // business logic
  const numElevators = calcCommercialElev(floors, apts)
  const totalCost = calcInstallFee(numElevators, tier)

  // format response
  res.send({
    elevators_required: numElevators,
    cost: totalCost
  })
}

const calcResidentialElev = (numFloors, numApts) => {
  const elevatorsRequired = Math.ceil(numApts / numFloors / 6) * Math.ceil(numFloors / 20)
  return elevatorsRequired
}

const calcCommercialElev = (numFloors, maxOccupancy) => {
  const elevatorsRequired = Math.ceil((maxOccupancy * numFloors) / 200) * Math.ceil(numFloors / 10)
  const freighElevatorsRequired = Math.ceil(numFloors / 10)
  return freighElevatorsRequired + elevatorsRequired
}

const calcInstallFee = (numElvs, tier) => {
  const unitPrice = Data.unitPrices[tier]
  const installPercentFees = Data.installPercentFees[tier]
  const total = numElvs * unitPrice * installPercentFees
  return total
}

module.exports = { calculateQuote, calculateResidentialQuote }
