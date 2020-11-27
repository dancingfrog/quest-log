if (!require("blogdown")) {
    install.packages("blogdown")
    library(blogdown)
    blogdown::install_hugo()
}
options(blogdown.generator.server = TRUE)
blogdown::serve_site()
