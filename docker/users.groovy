// Creates the visitor accounts of the training: alice and bob, password "training"
import org.jahia.services.content.JCRTemplate
import org.jahia.services.usermanager.JahiaUserManagerService

JCRTemplate.getInstance().doExecuteWithSystemSession { session ->
    def users = JahiaUserManagerService.getInstance()
    [alice: "Alice", bob: "Bob"].each { name, firstName ->
        if (users.lookupUser(name, session) == null) {
            def properties = new Properties()
            properties.put("j:firstName", firstName)
            users.createUser(name, "training", properties, session)
        }
    }
    session.save()
}
