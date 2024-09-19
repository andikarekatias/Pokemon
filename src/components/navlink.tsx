import { Link } from "@tanstack/react-router"
const navlink = () => {
  return (
    <>
        <li>
            <Link to="/" search={{ page: 1}} className="[&.active]:font-bold">
                Pokemon
            </Link>
        </li>
        <li>
            <a href="https://andikarekatias.com">
                Andika Rekatias
            </a>
        </li>
    </>
  )
}

export default navlink