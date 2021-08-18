import taxa from "../data/_taxonomies.json"
import sendNeeds from "../data/_send_needs.json"
import accessibility from "../data/_accessibility.json"

export const collectionOptions = taxa

export const sendOptions = sendNeeds

export const accessibilityOptions = accessibility.sort((a, b) =>
  a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1
)

export const subcategoriesOf = parent =>
  parent
    ? collectionOptions.filter(taxon => taxon.slug === parent)[0].children
    : []
