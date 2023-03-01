//const axios = require('axios')
const URL = 'http://localhost:3004/agents'

const currFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

const pcntFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
})

const styleRating = (rtng, col) => {
    col.style.color = 'white'
    if (rtng === 100) {
        col.style.background = 'green'
    }
    else if (rtng >= 90) {
        col.style.background = 'blue'
    } else {
        col.style.background = 'purple'
    }
    return col
}

const formatTableRow = (first, last, rtng, fee) => {
    const row = document.createElement('tr')
    let col = document.createElement('td')
    col.innerHTML = first
    row.appendChild(col)
    col = document.createElement('td')
    col.innerHTML = last
    row.appendChild(col)
    col = document.createElement('td')
    col.innerHTML = pcntFormatter.format(rtng / 100)
    row.appendChild(styleRating(rtng, col))
    col = document.createElement('td')
    col.innerHTML = currFormatter.format(fee)
    row.appendChild(col)
    return row
}

const formatData = async () => {
    try {
        const res = await fetch(URL)
        const data = await res.json()
        // console.log(data.agents)
        const frag = document.createDocumentFragment()
        data.agents.forEach((e) => {
            // console.log(e)
            frag.appendChild(formatTableRow(e.first_name, e.last_name, e.rating, e.fee))
        })
        const div = document.getElementById('agent-table-body')
        div.appendChild(frag)
    } catch (err) {
        console.error(err)
    }
}

formatData()

const sortAlpha = (col) => {
    sort(col, false)
}

const sortNum = (col) => {
    sort(col, true)
}

const sort = (col, isNum) => {
    let i = 0
    let switchcount = 0
    let shouldSwitch = false

    const table = document.getElementById("agent-table")

    // Set the sorting direction to ascending:
    let dir = "asc"

    /* Make a loop that will continue until
    no switching has been done: */
    let switching = true
    while (switching) {
        // Start by saying: no switching is done:
        switching = false
        let rows = table.rows
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            let x = rows[i].getElementsByTagName("TD")[col]
            let y = rows[i + 1].getElementsByTagName("TD")[col]
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir === "asc") {
                if (isNum) {
                    let fx = Number(x.innerHTML.replace(/[$,%]/g, ""))
                    let fy = Number(y.innerHTML.replace(/[$,%]/g, ""))
                    if (fx > fy) {
                        shouldSwitch = true
                        break
                    }
                } else {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true
                        break
                    }
                }
            } else {
                if (isNum) {
                    let fx = Number(x.innerHTML.replace(/[$,%]/g, ""))
                    let fy = Number(y.innerHTML.replace(/[$,%]/g, ""))
                    if (fx < fy) {
                        shouldSwitch = true
                        break
                    }
                } else {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true
                        break
                    }
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
            switching = true
            // Each time a switch is done, increase this count by 1:
            switchcount++
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir === "asc") {
                dir = "desc"
                switching = true
            }
        }
    }
}