module.exports = {
	"extends": ["react-app"],
	"plugins": ["simple-import-sort", "sort-destructure-keys"],
	"rules": {
	  "comma-spacing": "error",
	  "padding-line-between-statements": [
		"error",
		{ blankLine: "always", prev: "*", next: "return" },
	  ],
	  "simple-import-sort/imports": [
		"error",
		{
		  groups: [
			// Packages. `react` related packages come first.
			["^react", "^@?\\w"],
			// Internal packages.
			["^(@|@company|@ui|components|utils|types|config)(/.*|$)"],
			// Side effect imports.
			["^\\u0000"],
			// Parent imports. Put `..` last.
			["^\\.\\.(?!/?$)", "^\\.\\./?$"],
			// Other relative imports. Put same-folder imports and `.` last.
			["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
			// Style imports.
			["^.+\\.s?css$"],
		  ],
		},
	  ],
	  "simple-import-sort/exports": "error",
	  "sort-destructure-keys/sort-destructure-keys": "error",
	  "react/destructuring-assignment": "error",
	  "react/jsx-sort-props": [
		"error",
		{
		  shorthandLast: true,
		},
	  ],
	  "react/no-array-index-key": "error",
	},
	overrides: [{ files: ["**/*.ts?(x)"] }],
};
  