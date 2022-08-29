# [Research Engine](https://re-search-engine.herokuapp.com)

link: https://re-search-engine.herokuapp.com

<br>

### What is it for?
The Research Engine is a [Next.js](https://nextjs.org/) web application built to facilitate research by forwarding your query to various different search engines that specialise in searching for research papers so that you don't have to spend time scrolling through various different search engines to find what you're looking for.

### How does it work?
The engine forwards your query to 13 different search engines that specialise in research papers and gets the search results from each of them. The engine will then get the abstract of 10 of the results and display the title and the first 3 relevant sentences on the search results page. Do note that it does take some time (simply put, it's quite slow) for the application to get the data from so many different search engines and websites so please be patient. There is not much else I can do to improve the performance of the application given its nature.

<br>

### Search engines used
1. [ERIC (Education Resources Information Center)](https://eric.ed.gov/)
2. [CORE](https://core.ac.uk/)
3. [Semantic Scholar](https://www.semanticscholar.org/)
4. [PubMed](https://pubmed.ncbi.nlm.nih.gov/)
5. [BASE (Bielefeld Academic Search Engine)](https://www.base-search.net/)
6. [DOAJ (Directory of Open Access Journals)](https://doaj.org/)
7. [fatcat!](https://fatcat.wiki/)
8. [CiteSeerX](https://citeseerx.ist.psu.edu/)
9. [Paperity](https://paperity.org/)
10. [AMiner](https://www.aminer.org/)
11. [OSTI (U.S. Department of Energy
Office of Scientific and Technical Information)](https://www.osti.gov/)
12. [PLOS ONE](https://journals.plos.org/plosone/)
13. [Internet Archive Scholar](https://scholar.archive.org/)

<br>

### iOS Shortcut helper
There are two iOS shortcuts to help you interact with the API on the Research Engine and provide you with the information directly on your notes app. One of them is the main shortcut, the other one is simply a wrapper, adding a variable to shortcut so it'll run automatically and skip the user interaction part. This automated wrapper is meant to be run as an automation so that you'll get new results on a regular basis.

The main shortcut: https://www.icloud.com/shortcuts/d37c48ea3926407a89f1241ea2cca517

The automated wrapper shortcut: https://www.icloud.com/shortcuts/51f2ebce34a14c6a9c1f99f946a9957e

<br>

### Regarding privacy and cookies
This web application is fully open source and does not collect any user data or set any cookies. You can use it to avoid being tracked by the search engines above by using this application as most of them do set cookies in order for you to use the site.

### License and copyright information
This web application is licensed under the GNU AGPL v3 license. For the full license, look at the [LICENSE.txt](#LICENSE.txt) file.

<br>
<br>

## API Documentation

API endpoint: https://research-engine.vercel.app/api/search

Example API request: https://research-engine.vercel.app/api/search?q=animals&page=1&rich=true

<br>

Query parameters:
```
q: Your search term.

page: The page that you want. Note that there are 10 results per page.

rich: Set this to true if you want the search term within the relevant sentences to be bold.
```

<br>

JSON response data type:
```
{
  status: string,
  message: string,
  searchTerm?: string,
  pageNumber?: number,
  data?: {
    title: string,
    sentences: string[],
    link: string
  }[]
}
```

<br>

Example JSON response:
```
{
  "status": "200 OK",
  "message": "Request is successful!",
  "searchTerm": "animals",
  "pageNumber": 1,
  "data": [
    {
      "title": "Adult-perpetrated Animal Abuse: Development of a Proclivity Scale",
      "link": "https://core.ac.uk/works/8221111",
      "sentences": []
    },
    {
      "title": "The Guide for the Care and Use of Laboratory Animals.",
      "link": "https://www.semanticscholar.org/paper/5ff90750947c0c8192c4db979286649247c91814",
      "sentences": []
    },
    {
      "title": "Recognising sentience in animals - PubMed",
      "link": "https://pubmed.ncbi.nlm.nih.gov/34558701/",
      "sentences": []
    },
    {
      "title": "\n\t\tRE-EVALUATION OF ANIMAL PROTECTION BY THE FINNISH ANIMAL RIGHTS LAWYERS SOCIETY\n\t\t\t\t\t\t\t| Society Register\n\t\t\t",
      "link": "http://pressto.amu.edu.pl/index.php/sr/article/view/20645",
      "sentences": [
        "The recognition of animals as sentient beings in the Treaty on the Functioning of the European Union (TFEU) gave rise to expectations as to real concern and care for animal welfare and a balance of human-animal interests. However, both the EU-legislation and the Finnish animal protection legislation is based on an animal welfare paradigm, meaning that animals have a weak legal status compared to humans that makes it impossible to de facto balance human and animal needs and interests in an effective manner from an animal point of view. The weak legal status of animals in the hierarchy of norms in the Finnish legal system contributes to the continuation of the oppression and exploitation of animals.",
        "The Finnish Animal Rights Lawyers Society have therefore made a proposal to strengthen animals’ legal status by including animals in the Finnish Constitution (FC) by safeguarding animals’ certain fundamental rights, thereby providing tools for balancing of human-animals interests. This article focuses on the re-evaluation of animal protection from an animal and constitutional point of view."
      ]
    },
    {
      "title": "Estimates for Lyme borreliosis infections based on models using sentinel canine and human seroprevalence data",
      "link": "http://www.sciencedirect.com/science/article/pii/S2468042720300580",
      "sentences": []
    },
    {
      "title": "\n\"Animals and Animals\" by Laurence Thomas\n",
      "link": "https://doi.org/10.15368/bts.2010v13n10.11",
      "sentences": [
        "Speciesism is the wrong of not acknowledging the moral qualities that non-human animals possess that are similar or equivalent or even superior to the moral qualities that human beings possess. However, since it is manifestly clear that no one thinks that apes are in any way obligated to human beings, it clearly cannot be a form of speciesism to be mindful of the differences on the basis of which that is so. In opposition to the advocates of the Great Ape Project, my aim in this essay is to establish the quite minimal claim that apes should not have the same moral status as human beings because human beings have a far greater capacity for moral responsibility than do apes."
      ]
    },
    {
      "title": "CiteSeerX — Practical animation of liquids",
      "link": "http://citeseerx.ist.psu.edu/viewdoc/summary;jsessionid=065915BF4055D17317BBAADF71F2A836?doi=10.1.1.108.1269&rank=1&q=animals&osm=&ossid=",
      "sentences": []
    },
    {
      "title": "Are the folk utilitarian about animals? (pdf) | Paperity",
      "link": "https://paperity.org/p/293527237/are-the-folk-utilitarian-about-animals",
      "sentences": [
        "Robert Nozick famously raised the possibility that there is a sense in which both deontology and utilitarianism are true: deontology applies to humans while utilitarianism applies to animals. In recent years, there has been increasing interest in such a hybrid views of ethics. Discussions of this Nozickian Hybrid View, and similar approaches to animal ethics, often assume that such an approach reflects the commonsense view, and best captures common moral intuitions.",
        "However, recent psychological work challenges this empirical assumption. We review evidence suggesting that the folk is deontological all the way down—it is just that the moral side constraints that protect animals from harm are much weaker than those that protect humans. In fact, it appears that people even attribute some deontological protections, albeit extremely weak ones, to inanimate objects.",
        "That support belongs to Multi-level Weighted Deontology, a view that is also in line with the view that Nozick himself seemed to favour. To complicate things, however, we also review evidence that our intuitions about the moral status of humans are, at least in significant part, shaped by factors relating to mere species membership that seem morally irrelevant. We end by considering the potential debunking upshot of such findings about the sources of common moral intuitions about the moral status of animals."
      ]
    },
    {
      "title": "Redirecting",
      "link": "http://dx.doi.org/10.1016/S0021-9258(18)64849-5",
      "sentences": []
    },
    {
      "title": "An implantable biomechanical energy harvester for animal monitoring devices (Journal Article) | OSTI.GOV",
      "link": "https://www.osti.gov/biblio/1868349",
      "sentences": [
        "Insufficient service life and the resulting need for battery replacements have been a great challenge for implantable electronic devices. This is particularly true for animal tracking applications, because recapturing animals is often unlikely once they are released to the wild. To tackle this problem, we developed a biomechanical energy harvester that uses a Macro Fiber Composite™ (MFC) piezoelectric beam to harvest the mechanical energy from animals’ body bending movements as the power source for implantable and wearable devices."
      ]
    }
  ]
}
```