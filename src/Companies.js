import React from 'react'

export default function Companies({company, toggleCompany}) {
    function handleCompanyClick() {
        toggleCompany(company.id)
      }

    return (
      <tr key={company.id} style={{ borderBottom: "1px solid #000" }}>
        <td style={{ padding: "8px" }}>
          <input
            type="checkbox"
            checked={company.complete}
            onChange={() => handleCompanyClick(company.id)}
          />
        </td>
        <td style={{ padding: "8px" }}>
          <a href={company.url}>{company.name}</a>
        </td>
        <td style={{ padding: "8px" }}>
          {company.complete ? "Complete" : "Incomplete"}
        </td>
      </tr>
  )
}
