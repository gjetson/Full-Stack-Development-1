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
    if (type === 'residential') {
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
    const tier = req.query.tier.toLowerCase()
    if (!Object.keys(Data.unitPrices).includes(tier)) {
      res.status(400)
      return res.send(`Error: invalid tier. Must be 'standard', 'premium' or 'excelium'`)
    }

    const elevs = parseInt(req.query.elevs)
    if (!elevs || (elevs < 1)) {
      res.status(400)
      return res.send(`Error: 'elevs' query param must be an integer greater than zero. elevs = ${elevs}`)
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
  try {
    const tier = req.query.tier.toLowerCase()
    if (!Object.keys(Data.unitPrices).includes(tier)) {
      res.status(400)
      return res.send(`Error: invalid tier. Must be 'standard', 'premium' or 'excelium'. tier = ${tier}`)
    }

    const floors = parseInt(req.query.floors)
    if (!floors || floors < 1) {
      res.status(400)
      return res.send(`Error: 'floors' query param must be an integer greater than zero. floors = ${floors}`)
    }

    const apts = parseInt(req.query.apts)
    if (!apts || apts < 1) {
      res.status(400)
      return res.send(`Error: 'apts' query param must be an integer greater than zero. apts = ${apts}`)
    }

    // business logic
    const numElevators = calcResidentialElev(floors, apts)
    const totalCost = calcInstallFee(numElevators, tier)

    // format response
    res.send({
      elevators_required: numElevators,
      cost: totalCost
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: `${err.message}` })
  }
}

const calculateCommercialQuote = (req, res) => {
  try {
    const tier = req.query.tier.toLowerCase()
    if (!Object.keys(Data.unitPrices).includes(tier)) {
      res.status(400)
      return res.send(`Error: invalid tier. Must be 'standard', 'premium' or 'excelium'. tier = ${tier}`)
    }

    const floors = parseInt(req.query.floors)
    if (!floors || floors < 1) {
      res.status(400)
      return res.send(`Error: 'floors' query param must be an integer greater than zero. floors = ${floors}`)
    }

    const max_occ = parseInt(req.query.max_occ)
    if (!max_occ || max_occ < 1) {
      res.status(400)
      return res.send(`Error: 'max_occ' query param must be an integer greater than zero. max_occ = ${max_occ}`)
    }

    // business logic
    const numElevators = calcCommercialElev(floors, max_occ)
    const totalCost = calcInstallFee(numElevators, tier)

    // format response
    res.send({
      elevators_required: numElevators,
      cost: totalCost
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: `${err.message}` })
  }
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
